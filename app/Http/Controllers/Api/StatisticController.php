<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Statistic;
use Illuminate\Http\Request;

class StatisticController extends Controller
{
    public function index()
    {
        $statistics = Statistic::where('is_active', true)
            ->where(function($query) {
                $query->where('category', 'results')
                      ->orWhereNull('category');
            })
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $statistics
        ]);
    }

    public function impacts()
    {
        $impacts = Statistic::where('is_active', true)
            ->where('category', 'impacts')
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $impacts
        ]);
    }

    public function show($id)
    {
        $statistic = Statistic::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $statistic
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'value' => 'required|string|max:100',
            'icon' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'category' => 'nullable|string|max:50',
        ]);

        $statistic = Statistic::create($validated);

        return response()->json([
            'success' => true,
            'data' => $statistic,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $statistic = Statistic::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'value' => 'sometimes|required|string|max:100',
            'icon' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
            'category' => 'nullable|string|max:50',
        ]);

        // Utiliser only() pour ne prendre que les champs validés présents
        $data = $request->only([
            'title',
            'value',
            'icon',
            'description',
            'order',
            'is_active',
            'category',
        ]);

        // Filtrer les valeurs null pour ne pas écraser avec null
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        $statistic->update($data);

        return response()->json([
            'success' => true,
            'data' => $statistic->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $statistic = Statistic::findOrFail($id);
        $statistic->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    // Pour le dashboard : récupérer toutes les statistiques (actives et inactives)
    public function all()
    {
        $statistics = Statistic::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $statistics
        ]);
    }
}
