<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SupportProjectController extends Controller
{
    public function index(Request $request)
    {
        // Récupérer la langue depuis la requête ou utiliser 'fr' par défaut
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'ar', 'en']) ? $locale : 'fr';
        
        $projects = SupportProject::where('is_active', true)
            ->orderBy('is_highlighted', 'desc')
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Transformer les données pour inclure les traductions
        $transformedProjects = $projects->map(function ($item) use ($locale) {
            return $this->transformProjectItem($item, $locale);
        });

        return response()->json([
            'success' => true,
            'data' => $transformedProjects,
        ]);
    }

    public function all()
    {
        $projects = SupportProject::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    public function show(Request $request, $id)
    {
        // Récupérer la langue depuis la requête ou utiliser 'fr' par défaut
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'ar', 'en']) ? $locale : 'fr';
        
        $project = SupportProject::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->transformProjectItem($project, $locale),
        ]);
    }
    
    /**
     * Transformer un item project pour inclure les traductions selon la langue
     */
    private function transformProjectItem($project, $locale)
    {
        $titleColumn = "title_{$locale}";
        $excerptColumn = "excerpt_{$locale}";
        $descriptionColumn = "description_{$locale}";
        $categoryColumn = "category_{$locale}";
        $ctaLabelColumn = "cta_label_{$locale}";
        
        return [
            'id' => $project->id,
            'title' => $project->$titleColumn ?? $project->title_fr ?? $project->title,
            'excerpt' => $project->$excerptColumn ?? $project->excerpt_fr ?? $project->excerpt,
            'description' => $project->$descriptionColumn ?? $project->description_fr ?? $project->description,
            'category' => $project->$categoryColumn ?? $project->category_fr ?? $project->category,
            'cta_label' => $project->$ctaLabelColumn ?? $project->cta_label_fr ?? $project->cta_label,
            'image' => $project->image,
            'target_amount' => $project->target_amount,
            'current_amount' => $project->current_amount,
            'cta_link' => $project->cta_link,
            'order' => $project->order,
            'is_highlighted' => $project->is_highlighted,
            'is_active' => $project->is_active,
            'created_at' => $project->created_at,
            'updated_at' => $project->updated_at,
            // Inclure aussi toutes les traductions pour l'admin
            'title_fr' => $project->title_fr ?? $project->title,
            'title_ar' => $project->title_ar,
            'title_en' => $project->title_en,
            'excerpt_fr' => $project->excerpt_fr ?? $project->excerpt,
            'excerpt_ar' => $project->excerpt_ar,
            'excerpt_en' => $project->excerpt_en,
            'description_fr' => $project->description_fr ?? $project->description,
            'description_ar' => $project->description_ar,
            'description_en' => $project->description_en,
            'category_fr' => $project->category_fr ?? $project->category,
            'category_ar' => $project->category_ar,
            'category_en' => $project->category_en,
            'cta_label_fr' => $project->cta_label_fr ?? $project->cta_label,
            'cta_label_ar' => $project->cta_label_ar,
            'cta_label_en' => $project->cta_label_en,
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string|max:255',
            'excerpt_fr' => 'nullable|string|max:255',
            'excerpt_ar' => 'nullable|string|max:255',
            'excerpt_en' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'image' => 'nullable|image|max:4096', // 4MB max
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'category_fr' => 'nullable|string|max:255',
            'category_ar' => 'nullable|string|max:255',
            'category_en' => 'nullable|string|max:255',
            'cta_label' => 'nullable|string|max:255',
            'cta_label_fr' => 'nullable|string|max:255',
            'cta_label_ar' => 'nullable|string|max:255',
            'cta_label_en' => 'nullable|string|max:255',
            'cta_link' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_highlighted' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->only([
            'title',
            'title_fr', 'title_ar', 'title_en',
            'excerpt',
            'excerpt_fr', 'excerpt_ar', 'excerpt_en',
            'description',
            'description_fr', 'description_ar', 'description_en',
            'target_amount',
            'current_amount',
            'category',
            'category_fr', 'category_ar', 'category_en',
            'cta_label',
            'cta_label_fr', 'cta_label_ar', 'cta_label_en',
            'cta_link',
            'order',
            'is_highlighted',
            'is_active',
        ]);
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (empty($data['title_fr'])) {
            $data['title_fr'] = $data['title'];
        }
        if (empty($data['excerpt_fr']) && !empty($data['excerpt'])) {
            $data['excerpt_fr'] = $data['excerpt'];
        }
        if (empty($data['description_fr']) && !empty($data['description'])) {
            $data['description_fr'] = $data['description'];
        }
        if (empty($data['category_fr']) && !empty($data['category'])) {
            $data['category_fr'] = $data['category'];
        }
        if (empty($data['cta_label_fr']) && !empty($data['cta_label'])) {
            $data['cta_label_fr'] = $data['cta_label'];
        }

        // Gestion de l'upload d'image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects/images', 'public');
            // Utiliser un chemin relatif pour le frontend
            $data['image'] = '/storage/' . $path;
        }

        $project = SupportProject::create($data);

        return response()->json([
            'success' => true,
            'data' => $project,
            'message' => 'Projet de soutien créé avec succès',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $project = SupportProject::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string|max:255',
            'excerpt_fr' => 'nullable|string|max:255',
            'excerpt_ar' => 'nullable|string|max:255',
            'excerpt_en' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'image' => 'nullable|image|max:4096', // 4MB max
            'target_amount' => 'sometimes|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'category_fr' => 'nullable|string|max:255',
            'category_ar' => 'nullable|string|max:255',
            'category_en' => 'nullable|string|max:255',
            'cta_label' => 'nullable|string|max:255',
            'cta_label_fr' => 'nullable|string|max:255',
            'cta_label_ar' => 'nullable|string|max:255',
            'cta_label_en' => 'nullable|string|max:255',
            'cta_link' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_highlighted' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->only([
            'title',
            'title_fr', 'title_ar', 'title_en',
            'excerpt',
            'excerpt_fr', 'excerpt_ar', 'excerpt_en',
            'description',
            'description_fr', 'description_ar', 'description_en',
            'target_amount',
            'current_amount',
            'category',
            'category_fr', 'category_ar', 'category_en',
            'cta_label',
            'cta_label_fr', 'cta_label_ar', 'cta_label_en',
            'cta_link',
            'order',
            'is_highlighted',
            'is_active',
        ]);
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (isset($data['title']) && empty($data['title_fr'])) {
            $data['title_fr'] = $data['title'];
        }
        if (isset($data['excerpt']) && empty($data['excerpt_fr']) && !empty($data['excerpt'])) {
            $data['excerpt_fr'] = $data['excerpt'];
        }
        if (isset($data['description']) && empty($data['description_fr']) && !empty($data['description'])) {
            $data['description_fr'] = $data['description'];
        }
        if (isset($data['category']) && empty($data['category_fr']) && !empty($data['category'])) {
            $data['category_fr'] = $data['category'];
        }
        if (isset($data['cta_label']) && empty($data['cta_label_fr']) && !empty($data['cta_label'])) {
            $data['cta_label_fr'] = $data['cta_label'];
        }

        // Gestion de l'upload d'image
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image si elle existe
            if ($project->image && strpos($project->image, '/storage/') !== false) {
                $oldPath = str_replace('/storage/', '', $project->image);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $path = $request->file('image')->store('projects/images', 'public');
            // Utiliser un chemin relatif pour le frontend
            $data['image'] = '/storage/' . $path;
        } else {
            // Si aucune nouvelle image n'est fournie, conserver l'image existante
            // Ne pas modifier le champ image si aucun fichier n'est uploadé
            unset($data['image']);
        }

        $project->update($data);

        return response()->json([
            'success' => true,
            'data' => $project,
            'message' => 'Projet de soutien mis à jour avec succès',
        ]);
    }

    public function destroy($id)
    {
        $project = SupportProject::findOrFail($id);
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Projet de soutien supprimé avec succès',
        ]);
    }
}
