<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportGoal;
use Illuminate\Http\Request;

class SupportGoalController extends Controller
{
    public function index()
    {
        $goals = SupportGoal::where('is_active', true)
            ->orderBy('is_highlighted', 'desc')
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $goals,
        ]);
    }

    public function all()
    {
        $goals = SupportGoal::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $goals,
        ]);
    }

    public function show($id)
    {
        $goal = SupportGoal::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $goal,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'deadline' => 'nullable|string|max:255',
            'is_highlighted' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $goal = SupportGoal::create($validated);

        return response()->json([
            'success' => true,
            'data' => $goal,
            'message' => 'Objectif créé avec succès',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $goal = SupportGoal::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'sometimes|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'deadline' => 'nullable|string|max:255',
            'is_highlighted' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $goal->update($validated);

        return response()->json([
            'success' => true,
            'data' => $goal,
            'message' => 'Objectif mis à jour avec succès',
        ]);
    }

    public function destroy($id)
    {
        $goal = SupportGoal::findOrFail($id);
        $goal->delete();

        return response()->json([
            'success' => true,
            'message' => 'Objectif supprimé avec succès',
        ]);
    }
}
