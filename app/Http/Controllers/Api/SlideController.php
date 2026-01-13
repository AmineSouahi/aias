<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slide;
use Illuminate\Http\Request;

class SlideController extends Controller
{
    /**
     * Display a listing of active slides for public site.
     */
    public function index(Request $request)
    {
        // Récupérer la langue depuis la requête ou utiliser 'fr' par défaut
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'ar', 'en']) ? $locale : 'fr';
        
        $slides = Slide::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Transformer les données pour inclure les traductions
        $transformedSlides = $slides->map(function ($item) use ($locale) {
            return $this->transformSlideItem($item, $locale);
        });

        return response()->json([
            'success' => true,
            'data' => $transformedSlides,
        ]);
    }
    
    /**
     * Transformer un item slide pour inclure les traductions selon la langue
     */
    private function transformSlideItem($slide, $locale)
    {
        $titleColumn = "title_{$locale}";
        $descriptionColumn = "description_{$locale}";
        $buttonTextColumn = "button_text_{$locale}";
        
        return [
            'id' => $slide->id,
            'title' => $slide->$titleColumn ?? $slide->title_fr ?? $slide->title,
            'description' => $slide->$descriptionColumn ?? $slide->description_fr ?? $slide->description,
            'button_text' => $slide->$buttonTextColumn ?? $slide->button_text_fr ?? $slide->button_text,
            'button_link' => $slide->button_link,
            'image' => $slide->image,
            'order' => $slide->order,
            'is_active' => $slide->is_active,
            'created_at' => $slide->created_at,
            'updated_at' => $slide->updated_at,
            // Inclure aussi toutes les traductions pour l'admin
            'title_fr' => $slide->title_fr ?? $slide->title,
            'title_ar' => $slide->title_ar,
            'title_en' => $slide->title_en,
            'description_fr' => $slide->description_fr ?? $slide->description,
            'description_ar' => $slide->description_ar,
            'description_en' => $slide->description_en,
            'button_text_fr' => $slide->button_text_fr ?? $slide->button_text,
            'button_text_ar' => $slide->button_text_ar,
            'button_text_en' => $slide->button_text_en,
        ];
    }

    /**
     * Display all slides for dashboard.
     */
    public function all()
    {
        $slides = Slide::orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $slides,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $slide = Slide::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $slide,
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
            'description' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'image' => 'nullable|image|max:4096',
            'button_text' => 'nullable|string|max:255',
            'button_text_fr' => 'nullable|string|max:255',
            'button_text_ar' => 'nullable|string|max:255',
            'button_text_en' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $data = $request->only([
            'title',
            'title_fr', 'title_ar', 'title_en',
            'description',
            'description_fr', 'description_ar', 'description_en',
            'button_text',
            'button_text_fr', 'button_text_ar', 'button_text_en',
            'button_link',
            'order',
            'is_active',
        ]);
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (empty($data['title_fr'])) {
            $data['title_fr'] = $data['title'];
        }
        if (empty($data['description_fr']) && !empty($data['description'])) {
            $data['description_fr'] = $data['description'];
        }
        if (empty($data['button_text_fr']) && !empty($data['button_text'])) {
            $data['button_text_fr'] = $data['button_text'];
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('slides', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $slide = Slide::create($data);

        return response()->json([
            'success' => true,
            'data' => $slide,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $slide = Slide::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'image' => 'nullable|image|max:4096',
            'button_text' => 'nullable|string|max:255',
            'button_text_fr' => 'nullable|string|max:255',
            'button_text_ar' => 'nullable|string|max:255',
            'button_text_en' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $data = $request->only([
            'title',
            'title_fr', 'title_ar', 'title_en',
            'description',
            'description_fr', 'description_ar', 'description_en',
            'button_text',
            'button_text_fr', 'button_text_ar', 'button_text_en',
            'button_link',
            'order',
            'is_active',
        ]);
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (isset($data['title']) && empty($data['title_fr'])) {
            $data['title_fr'] = $data['title'];
        }
        if (isset($data['description']) && empty($data['description_fr']) && !empty($data['description'])) {
            $data['description_fr'] = $data['description'];
        }
        if (isset($data['button_text']) && empty($data['button_text_fr']) && !empty($data['button_text'])) {
            $data['button_text_fr'] = $data['button_text'];
        }

        // Filtrer les valeurs null pour ne pas écraser avec null
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image si elle existe
            if ($slide->image && file_exists(public_path($slide->image))) {
                @unlink(public_path($slide->image));
            }
            $path = $request->file('image')->store('slides', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $slide->update($data);

        return response()->json([
            'success' => true,
            'data' => $slide->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $slide = Slide::findOrFail($id);

        // Supprimer l'image si elle existe
        if ($slide->image && file_exists(public_path($slide->image))) {
            unlink(public_path($slide->image));
        }

        $slide->delete();

        return response()->json([
            'success' => true,
            'message' => 'Slide supprimé avec succès',
        ]);
    }
}
