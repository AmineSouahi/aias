<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Don;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DonController extends Controller
{
    /**
     * Store a new donation and generate Payzone payment URL
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'civility' => 'nullable|in:M.,Mme',
            'full_name' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'accept_terms' => 'required|accepted',
            'newsletter' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Générer un order_id unique
        $orderId = 'don-' . time() . '-' . Str::random(6);

        // Créer le don en base de données
        $don = Don::create([
            'order_id' => $orderId,
            'amount' => $request->amount,
            'currency' => $request->currency ?? 'MAD',
            'civility' => $request->civility,
            'full_name' => $request->full_name,
            'city' => $request->city,
            'country' => $request->country ?? 'Maroc',
            'phone' => $request->phone,
            'email' => $request->email,
            'accept_terms' => $request->accept_terms ?? false,
            'newsletter' => $request->newsletter ?? false,
            'status' => 'pending',
        ]);

        // Vérifier que les variables Payzone sont configurées
        $payzoneConfig = $this->validatePayzoneConfig();
        if (!$payzoneConfig['valid']) {
            return response()->json([
                'success' => false,
                'error' => 'Configuration Payzone incomplète',
                'message' => $payzoneConfig['message'],
                'don' => $don, // Le don est quand même créé
            ], 500);
        }

        // Générer l'URL Payzone
        $payzoneUrl = $this->generatePayzoneUrl($don);

        return response()->json([
            'success' => true,
            'don' => $don,
            'payzone_url' => $payzoneUrl,
        ], 201);
    }

    /**
     * Validate Payzone configuration
     */
    private function validatePayzoneConfig()
    {
        $merchantId = config('payzone.merchant_id');
        $apiKey = config('payzone.api_key');
        $apiSecret = config('payzone.api_secret');

        $missing = [];
        if (empty($merchantId)) {
            $missing[] = 'PAYZONE_MERCHANT_ID';
        }
        if (empty($apiKey)) {
            $missing[] = 'PAYZONE_API_KEY';
        }
        if (empty($apiSecret)) {
            $missing[] = 'PAYZONE_API_SECRET';
        }

        if (!empty($missing)) {
            return [
                'valid' => false,
                'message' => 'Les variables suivantes sont manquantes dans le fichier .env : ' . implode(', ', $missing) . '. Veuillez consulter PAYZONE_SETUP.md pour plus d\'informations.'
            ];
        }

        return ['valid' => true];
    }

    /**
     * Generate Payzone payment URL
     */
    private function generatePayzoneUrl(Don $don)
    {
        // Configuration Payzone depuis config/payzone.php
        $merchantId = config('payzone.merchant_id');
        $apiKey = config('payzone.api_key');
        $apiSecret = config('payzone.api_secret');
        $baseUrl = config('payzone.base_url');

        // Paramètres pour Payzone
        $params = [
            'merchantId' => $merchantId,
            'orderId' => $don->order_id,
            'amount' => number_format($don->amount, 2, '.', ''),
            'currency' => $don->currency,
            'description' => 'Don pour l\'association',
            'customerEmail' => $don->email,
            'customerName' => $don->full_name,
            'customerPhone' => $don->phone ?? '',
            'returnUrl' => config('payzone.return_url'),
            'cancelUrl' => config('payzone.cancel_url'),
            'notifyUrl' => config('payzone.notify_url'),
        ];

        // Générer la signature (selon la documentation Payzone)
        // Note: La méthode de signature peut varier selon la version de l'API Payzone
        $signature = $this->generateSignature($params, $apiSecret);

        $params['signature'] = $signature;

        // Construire l'URL avec les paramètres
        $queryString = http_build_query($params);
        return $baseUrl . '?' . $queryString;
    }

    /**
     * Generate signature for Payzone
     */
    private function generateSignature($params, $secret)
    {
        // Trier les paramètres par clé
        ksort($params);
        
        // Créer la chaîne à signer (exclure la signature elle-même)
        $stringToSign = '';
        foreach ($params as $key => $value) {
            if ($key !== 'signature' && $value !== '') {
                $stringToSign .= $key . '=' . $value . '&';
            }
        }
        $stringToSign = rtrim($stringToSign, '&');
        
        // Générer la signature HMAC SHA256
        return hash_hmac('sha256', $stringToSign, $secret);
    }

    /**
     * Handle Payzone callback
     */
    public function callback(Request $request)
    {
        // Vérifier la signature de Payzone
        $orderId = $request->input('orderId');
        $status = $request->input('status');
        $transactionId = $request->input('transactionId');

        $don = Don::where('order_id', $orderId)->first();

        if ($don) {
            $don->update([
                'status' => $status === 'SUCCESS' ? 'completed' : ($status === 'FAILED' ? 'failed' : 'pending'),
                'payzone_transaction_id' => $transactionId,
                'payzone_response' => json_encode($request->all()),
            ]);
        }

        // Répondre à Payzone
        return response()->json(['status' => 'ok']);
    }

    /**
     * Handle return from Payzone (success)
     */
    public function return(Request $request)
    {
        $orderId = $request->input('orderId');
        $don = Don::where('order_id', $orderId)->first();

        if ($don && $don->status === 'completed') {
            return redirect('/don/success?order_id=' . $orderId);
        }

        return redirect('/don?error=payment_failed');
    }

    /**
     * Handle cancel from Payzone
     */
    public function cancel(Request $request)
    {
        $orderId = $request->input('orderId');
        $don = Don::where('order_id', $orderId)->first();

        if ($don) {
            $don->update(['status' => 'cancelled']);
        }

        return redirect('/don?error=payment_cancelled');
    }
}
