<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChartData;
use Illuminate\Http\Request;

class ChartDataController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type'); // 'line' ou 'pie'
        
        $query = ChartData::where('is_active', true);
        
        if ($type) {
            $query->where('chart_type', $type);
        }
        
        $chartData = $query->orderBy('order', 'asc')
            ->orderBy('year', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $chartData
        ]);
    }

    public function all()
    {
        $chartData = ChartData::orderBy('chart_type', 'asc')
            ->orderBy('order', 'asc')
            ->orderBy('year', 'asc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $chartData
        ]);
    }

    public function show($id)
    {
        $chartData = ChartData::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $chartData
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'chart_type' => 'required|in:line,pie',
            'name' => 'required|string|max:255',
            'value' => 'required|numeric',
            'color' => 'nullable|string|max:7',
            'year' => 'nullable|integer',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $chartData = ChartData::create($validated);
        
        return response()->json([
            'success' => true,
            'data' => $chartData,
            'message' => 'Donnée de graphique créée avec succès'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $chartData = ChartData::findOrFail($id);
        
        $validated = $request->validate([
            'chart_type' => 'sometimes|in:line,pie',
            'name' => 'sometimes|string|max:255',
            'value' => 'sometimes|numeric',
            'color' => 'nullable|string|max:7',
            'year' => 'nullable|integer',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $chartData->update($validated);
        
        return response()->json([
            'success' => true,
            'data' => $chartData,
            'message' => 'Donnée de graphique mise à jour avec succès'
        ]);
    }

    public function destroy($id)
    {
        $chartData = ChartData::findOrFail($id);
        $chartData->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Donnée de graphique supprimée avec succès'
        ]);
    }
}
