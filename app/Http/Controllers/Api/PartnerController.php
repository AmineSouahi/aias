<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    public function index(Request $request)
    {
        // Récupérer la langue depuis la requête ou utiliser 'fr' par défaut
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'ar', 'en']) ? $locale : 'fr';
        
        $partners = Partner::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Transformer les données pour inclure les traductions
        $transformedPartners = $partners->map(function ($item) use ($locale) {
            return $this->transformPartnerItem($item, $locale);
        });
        
        return response()->json([
            'success' => true,
            'data' => $transformedPartners
        ]);
    }

    public function show(Request $request, $id)
    {
        // Récupérer la langue depuis la requête ou utiliser 'fr' par défaut
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'ar', 'en']) ? $locale : 'fr';
        
        $partner = Partner::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $this->transformPartnerItem($partner, $locale)
        ]);
    }
    
    /**
     * Transformer un item partner pour inclure les traductions selon la langue
     */
    private function transformPartnerItem($partner, $locale)
    {
        $nameColumn = "name_{$locale}";
        $descriptionColumn = "description_{$locale}";
        $excerptColumn = "excerpt_{$locale}";
        
        return [
            'id' => $partner->id,
            'name' => $partner->$nameColumn ?? $partner->name_fr ?? $partner->name,
            'description' => $partner->$descriptionColumn ?? $partner->description_fr ?? $partner->description,
            'excerpt' => $partner->$excerptColumn ?? $partner->excerpt_fr ?? $partner->excerpt,
            'logo' => $partner->logo,
            'image' => $partner->image,
            'images' => $partner->images,
            'website_url' => $partner->website_url,
            'beneficiaries_count' => $partner->beneficiaries_count,
            'order' => $partner->order,
            'is_active' => $partner->is_active,
            'created_at' => $partner->created_at,
            'updated_at' => $partner->updated_at,
            // Inclure aussi toutes les traductions pour l'admin
            'name_fr' => $partner->name_fr ?? $partner->name,
            'name_ar' => $partner->name_ar,
            'name_en' => $partner->name_en,
            'description_fr' => $partner->description_fr ?? $partner->description,
            'description_ar' => $partner->description_ar,
            'description_en' => $partner->description_en,
            'excerpt_fr' => $partner->excerpt_fr ?? $partner->excerpt,
            'excerpt_ar' => $partner->excerpt_ar,
            'excerpt_en' => $partner->excerpt_en,
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'image' => 'nullable|image|max:4096',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|max:4096',
            'excerpt' => 'nullable|string',
            'excerpt_fr' => 'nullable|string',
            'excerpt_ar' => 'nullable|string',
            'excerpt_en' => 'nullable|string',
            'description' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'website_url' => 'nullable|url|max:500',
            'beneficiaries_count' => 'nullable|integer|min:0',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $data = $request->only([
            'name',
            'name_fr', 'name_ar', 'name_en',
            'excerpt',
            'excerpt_fr', 'excerpt_ar', 'excerpt_en',
            'description',
            'description_fr', 'description_ar', 'description_en',
            'website_url',
            'beneficiaries_count',
            'order',
            'is_active',
        ]);
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (empty($data['name_fr'])) {
            $data['name_fr'] = $data['name'];
        }
        if (empty($data['description_fr']) && !empty($data['description'])) {
            $data['description_fr'] = $data['description'];
        }
        if (empty($data['excerpt_fr']) && !empty($data['excerpt'])) {
            $data['excerpt_fr'] = $data['excerpt'];
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('partners/logos', 'public');
            $data['logo'] = '/storage/' . $path;
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('partners/images', 'public');
            $data['image'] = '/storage/' . $path;
        }

        if ($request->hasFile('images')) {
            $paths = [];
            foreach ($request->file('images') as $file) {
                $paths[] = '/storage/' . $file->store('partners/gallery', 'public');
            }
            $data['images'] = $paths;
        }

        $partner = Partner::create($data);

        return response()->json([
            'success' => true,
            'data' => $partner,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'image' => 'nullable|image|max:4096',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|max:4096',
            'excerpt' => 'nullable|string',
            'excerpt_fr' => 'nullable|string',
            'excerpt_ar' => 'nullable|string',
            'excerpt_en' => 'nullable|string',
            'description' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'website_url' => 'nullable|url|max:500',
            'beneficiaries_count' => 'nullable|integer|min:0',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $data = $request->only([
            'name',
            'name_fr', 'name_ar', 'name_en',
            'excerpt',
            'excerpt_fr', 'excerpt_ar', 'excerpt_en',
            'description',
            'description_fr', 'description_ar', 'description_en',
            'website_url',
            'beneficiaries_count',
            'order',
            'is_active',
        ]);
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (isset($data['name']) && empty($data['name_fr'])) {
            $data['name_fr'] = $data['name'];
        }
        if (isset($data['description']) && empty($data['description_fr']) && !empty($data['description'])) {
            $data['description_fr'] = $data['description'];
        }
        if (isset($data['excerpt']) && empty($data['excerpt_fr']) && !empty($data['excerpt'])) {
            $data['excerpt_fr'] = $data['excerpt'];
        }

        // Gérer la suppression du logo
        if ($request->has('delete_logo') && $request->delete_logo === '1') {
            if ($partner->logo && Storage::disk('public')->exists(str_replace('/storage/', '', $partner->logo))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $partner->logo));
            }
            $data['logo'] = null;
        } elseif ($request->hasFile('logo')) {
            if ($partner->logo && Storage::disk('public')->exists(str_replace('/storage/', '', $partner->logo))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $partner->logo));
            }
            $path = $request->file('logo')->store('partners/logos', 'public');
            $data['logo'] = '/storage/' . $path;
        }

        // Gérer la suppression de l'image principale
        if ($request->has('delete_image') && $request->delete_image === '1') {
            if ($partner->image && Storage::disk('public')->exists(str_replace('/storage/', '', $partner->image))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $partner->image));
            }
            $data['image'] = null;
        } elseif ($request->hasFile('image')) {
            if ($partner->image && Storage::disk('public')->exists(str_replace('/storage/', '', $partner->image))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $partner->image));
            }
            $path = $request->file('image')->store('partners/images', 'public');
            $data['image'] = '/storage/' . $path;
        }

        // Gérer la suppression d'images de la galerie
        if ($request->has('delete_gallery_images') && is_array($request->delete_gallery_images) && count($request->delete_gallery_images) > 0) {
            $currentImages = $partner->images && is_array($partner->images) ? $partner->images : [];
            $imagesToKeep = [];
            
            foreach ($currentImages as $img) {
                if (!in_array($img, $request->delete_gallery_images)) {
                    $imagesToKeep[] = $img;
                } else {
                    // Supprimer le fichier
                    if ($img && Storage::disk('public')->exists(str_replace('/storage/', '', $img))) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $img));
                    }
                }
            }
            
            // Ajouter les nouvelles images si présentes
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $imagesToKeep[] = '/storage/' . $file->store('partners/gallery', 'public');
                }
            }
            
            $data['images'] = $imagesToKeep;
        } elseif ($request->hasFile('images')) {
            // Si de nouvelles images sont uploadées sans suppression spécifique, remplacer toutes les anciennes
            if ($partner->images && is_array($partner->images)) {
                foreach ($partner->images as $oldImg) {
                    if ($oldImg && Storage::disk('public')->exists(str_replace('/storage/', '', $oldImg))) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $oldImg));
                    }
                }
            }
            $paths = [];
            foreach ($request->file('images') as $file) {
                $paths[] = '/storage/' . $file->store('partners/gallery', 'public');
            }
            $data['images'] = $paths;
        }
        // Si aucune modification de la galerie, on ne touche pas à $data['images'] pour préserver les images existantes

        $partner->update($data);

        return response()->json([
            'success' => true,
            'data' => $partner,
        ]);
    }

    public function destroy($id)
    {
        $partner = Partner::findOrFail($id);
        
        // Supprimer le logo si existe
        if ($partner->logo && Storage::disk('public')->exists(str_replace('/storage/', '', $partner->logo))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $partner->logo));
        }
        
        // Supprimer l'image principale si existe
        if ($partner->image && Storage::disk('public')->exists(str_replace('/storage/', '', $partner->image))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $partner->image));
        }
        
        // Supprimer les images de la galerie si existent
        if ($partner->images && is_array($partner->images)) {
            foreach ($partner->images as $img) {
                if ($img && Storage::disk('public')->exists(str_replace('/storage/', '', $img))) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $img));
                }
            }
        }
        
        $partner->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    // Pour le dashboard : récupérer tous les partenaires (actifs et inactifs)
    public function all()
    {
        $partners = Partner::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $partners
        ]);
    }
}
