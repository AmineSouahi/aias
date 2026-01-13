<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Impact;
use Illuminate\Http\Request;

class ImpactController extends Controller
{
    /**
     * Display a listing of active impacts for public site.
     */
    public function index(Request $request)
    {
        // Récupérer la langue depuis la requête ou utiliser 'fr' par défaut
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'ar', 'en']) ? $locale : 'fr';
        
        $impacts = Impact::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Transformer les données pour inclure les traductions
        $transformedImpacts = $impacts->map(function ($item) use ($locale) {
            return $this->transformImpactItem($item, $locale);
        });

        return response()->json([
            'success' => true,
            'data' => $transformedImpacts,
        ]);
    }
    
    /**
     * Transformer un item impact pour inclure les traductions selon la langue
     */
    private function transformImpactItem($impact, $locale)
    {
        $titleColumn = "title_{$locale}";
        
        return [
            'id' => $impact->id,
            'title' => $impact->$titleColumn ?? $impact->title_fr ?? $impact->title,
            'icon' => $impact->icon,
            'value' => $impact->value,
            'graph_data' => $impact->graph_data,
            'order' => $impact->order,
            'is_active' => $impact->is_active,
            'created_at' => $impact->created_at,
            'updated_at' => $impact->updated_at,
            // Inclure aussi toutes les traductions pour l'admin
            'title_fr' => $impact->title_fr ?? $impact->title,
            'title_ar' => $impact->title_ar,
            'title_en' => $impact->title_en,
        ];
    }

    /**
     * Display all impacts for dashboard.
     */
    public function all()
    {
        $impacts = Impact::orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $impacts,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $impact = Impact::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $impact,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:100',
            'value' => 'required|string|max:100',
            'graph_data' => 'nullable|array',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $data = $validated;
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (empty($data['title_fr'])) {
            $data['title_fr'] = $data['title'];
        }

        $impact = Impact::create($data);

        return response()->json([
            'success' => true,
            'data' => $impact,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $impact = Impact::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:100',
            'value' => 'sometimes|required|string|max:100',
            'graph_data' => 'nullable|array',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        // Filtrer les valeurs null pour ne pas écraser avec null
        $data = array_filter($validated, function($value) {
            return $value !== null;
        });
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (isset($data['title']) && empty($data['title_fr'])) {
            $data['title_fr'] = $data['title'];
        }

        $impact->update($data);

        return response()->json([
            'success' => true,
            'data' => $impact->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $impact = Impact::findOrFail($id);
        $impact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Impact supprimé avec succès',
        ]);
    }
}
