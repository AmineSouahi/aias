<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExecutiveMember;
use Illuminate\Http\Request;

class ExecutiveMemberController extends Controller
{
    /**
     * Display a listing of active members for public site.
     */
    public function index()
    {
        $members = ExecutiveMember::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $members,
        ]);
    }

    /**
     * Display all members for dashboard.
     */
    public function all()
    {
        $members = ExecutiveMember::orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $members,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $member = ExecutiveMember::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $member,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'photo' => 'nullable|image|max:4096',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $data = $request->only([
            'name',
            'position',
            'order',
            'is_active',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('executive-members', 'public');
            $data['photo'] = '/storage/' . $path;
        }

        $member = ExecutiveMember::create($data);

        return response()->json([
            'success' => true,
            'data' => $member,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $member = ExecutiveMember::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'photo' => 'nullable|image|max:4096',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $data = $request->only([
            'name',
            'position',
            'order',
            'is_active',
        ]);

        // Filtrer les valeurs null pour ne pas écraser avec null
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo si elle existe
            if ($member->photo && file_exists(public_path($member->photo))) {
                @unlink(public_path($member->photo));
            }
            $path = $request->file('photo')->store('executive-members', 'public');
            $data['photo'] = '/storage/' . $path;
        }

        $member->update($data);

        return response()->json([
            'success' => true,
            'data' => $member->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $member = ExecutiveMember::findOrFail($id);

        // Supprimer la photo si elle existe
        if ($member->photo && file_exists(public_path($member->photo))) {
            @unlink(public_path($member->photo));
        }

        $member->delete();

        return response()->json([
            'success' => true,
            'message' => 'Membre supprimé avec succès',
        ]);
    }
}
