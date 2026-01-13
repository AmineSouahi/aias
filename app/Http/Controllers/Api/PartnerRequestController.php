<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class PartnerRequestController extends Controller
{
    /**
     * Réception d'une demande de partenariat et envoi par email.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'organization_name' => 'required|string|max:255',
            'contact_name'      => 'required|string|max:255',
            'email'             => 'required|email|max:255',
            'phone'             => 'nullable|string|max:30',
            'website'           => 'nullable|string|max:255',
            'partnership_type'  => 'nullable|string|max:100',
            'message'           => 'required|string|max:3000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Adresse de réception : variable dédiée, sinon adresse "from" par défaut
        $to = config('mail.partner_requests_to') ?: config('mail.from.address');

        if ($to) {
            $subject = 'Nouvelle demande de partenariat - ' . $data['organization_name'];

            $body  = "Une nouvelle demande de partenariat a été soumise :\n\n";
            $body .= "Organisation : {$data['organization_name']}\n";
            $body .= "Contact      : {$data['contact_name']}\n";
            $body .= "Email        : {$data['email']}\n";
            $body .= "Téléphone    : " . ($data['phone'] ?? '-') . "\n";
            $body .= "Site web     : " . ($data['website'] ?? '-') . "\n";
            $body .= "Type         : " . ($data['partnership_type'] ?? '-') . "\n\n";
            $body .= "Message :\n{$data['message']}\n";

            Mail::raw($body, function ($message) use ($to, $subject) {
                $message->to($to)->subject($subject);
            });
        }

        return response()->json([
            'success' => true,
            'message' => 'Merci pour votre intérêt ! Votre demande de partenariat a bien été envoyée.',
            'data'    => $data,
        ], 201);
    }
}
