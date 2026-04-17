<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    /**
     * Convert legacy/Windows paths to browser-friendly public URLs.
     */
    private function normalizeMediaUrl($value)
    {
        if (!$value || !is_string($value)) {
            return null;
        }

        $url = trim(str_replace('\\', '/', $value));
        if ($url === '') {
            return null;
        }

        // Keep absolute external URLs untouched.
        if (preg_match('#^https?://#i', $url)) {
            return $url;
        }

        // Legacy values stored as /news/... should be served from /storage/news/...
        if (str_starts_with($url, '/news/')) {
            return '/storage' . $url;
        }

        if (str_starts_with($url, 'news/')) {
            return '/storage/' . $url;
        }

        if (str_starts_with($url, '/storage/')) {
            return $url;
        }

        if (str_starts_with($url, 'storage/')) {
            return '/' . $url;
        }

        return str_starts_with($url, '/') ? $url : '/' . $url;
    }

    public function index(Request $request)
    {
        // Récupérer la langue depuis la requête ou utiliser 'fr' par défaut
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'ar', 'en']) ? $locale : 'fr';
        
        // Récupérer toutes les news (sans pagination pour le dashboard)
        $news = News::orderBy('created_at', 'desc')->get();
        
        // Transformer les données pour inclure les traductions
        $transformedNews = $news->map(function ($item) use ($locale) {
            return $this->transformNewsItem($item, $locale);
        });
        
        return response()->json([
            'success' => true,
            'data' => $transformedNews
        ]);
    }

    public function show(Request $request, $id)
    {
        // Récupérer la langue depuis la requête ou utiliser 'fr' par défaut
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'ar', 'en']) ? $locale : 'fr';
        
        $news = News::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $this->transformNewsItem($news, $locale)
        ]);
    }
    
    /**
     * Transformer un item news pour inclure les traductions selon la langue
     */
    private function transformNewsItem($news, $locale)
    {
        // Récupérer les valeurs traduites ou utiliser les valeurs par défaut
        $titleColumn = "title_{$locale}";
        $excerptColumn = "excerpt_{$locale}";
        $contentColumn = "content_{$locale}";
        
        $images = [];
        if (is_array($news->images)) {
            $images = array_values(array_filter(array_map(function ($img) {
                return $this->normalizeMediaUrl($img);
            }, $news->images)));
        }

        return [
            'id' => $news->id,
            'title' => $news->$titleColumn ?? $news->title_fr ?? $news->title,
            'excerpt' => $news->$excerptColumn ?? $news->excerpt_fr ?? $news->excerpt,
            'content' => $news->$contentColumn ?? $news->content_fr ?? $news->content,
            'image' => $this->normalizeMediaUrl($news->image),
            'images' => $images,
            'video_url' => $this->normalizeMediaUrl($news->video_url),
            'published_at' => $news->published_at,
            'is_published' => $news->is_published,
            'created_at' => $news->created_at,
            'updated_at' => $news->updated_at,
            // Inclure aussi toutes les traductions pour l'admin
            'title_fr' => $news->title_fr ?? $news->title,
            'title_ar' => $news->title_ar,
            'title_en' => $news->title_en,
            'excerpt_fr' => $news->excerpt_fr ?? $news->excerpt,
            'excerpt_ar' => $news->excerpt_ar,
            'excerpt_en' => $news->excerpt_en,
            'content_fr' => $news->content_fr ?? $news->content,
            'content_ar' => $news->content_ar,
            'content_en' => $news->content_en,
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'excerpt' => 'required|string',
            'excerpt_fr' => 'nullable|string',
            'excerpt_ar' => 'nullable|string',
            'excerpt_en' => 'nullable|string',
            'content' => 'nullable|string',
            'content_fr' => 'nullable|string',
            'content_ar' => 'nullable|string',
            'content_en' => 'nullable|string',
            // Fichiers uploadés
            'image' => 'nullable|image|max:4096', // 4MB
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|max:4096',
            'video' => 'nullable|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/webm|max:51200', // 50MB
            // Valeurs simples
            'video_url' => 'nullable|string|max:2048',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        $data = $request->only([
            'title',
            'title_fr', 'title_ar', 'title_en',
            'excerpt',
            'excerpt_fr', 'excerpt_ar', 'excerpt_en',
            'content',
            'content_fr', 'content_ar', 'content_en',
            'published_at',
            'is_published',
            'video_url',
        ]);
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (empty($data['title_fr'])) {
            $data['title_fr'] = $data['title'];
        }
        if (empty($data['excerpt_fr'])) {
            $data['excerpt_fr'] = $data['excerpt'];
        }
        if (empty($data['content_fr']) && !empty($data['content'])) {
            $data['content_fr'] = $data['content'];
        }

        // Image principale
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('news/images', 'public');
            $data['image'] = '/storage/' . $path;
        }

        // Galerie d'images
        if ($request->hasFile('images')) {
            $paths = [];
            foreach ($request->file('images') as $file) {
                $paths[] = '/storage/' . $file->store('news/gallery', 'public');
            }
            $data['images'] = $paths;
        }

        // Vidéo locale
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('news/videos', 'public');
            // On stocke le chemin dans la colonne video_url existante
            $data['video_url'] = '/storage/' . $videoPath;
        }

        $news = News::create($data);

        return response()->json([
            'success' => true,
            'data' => $news,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'excerpt' => 'sometimes|required|string',
            'excerpt_fr' => 'nullable|string',
            'excerpt_ar' => 'nullable|string',
            'excerpt_en' => 'nullable|string',
            'content' => 'nullable|string',
            'content_fr' => 'nullable|string',
            'content_ar' => 'nullable|string',
            'content_en' => 'nullable|string',
            // Fichiers uploadés
            'image' => 'nullable|image|max:4096',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|max:4096',
            'video' => 'nullable|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/webm|max:51200',
            // Valeurs simples
            'video_url' => 'nullable|string|max:2048',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        $data = $request->only([
            'title',
            'title_fr', 'title_ar', 'title_en',
            'excerpt',
            'excerpt_fr', 'excerpt_ar', 'excerpt_en',
            'content',
            'content_fr', 'content_ar', 'content_en',
            'published_at',
            'is_published',
            'video_url',
        ]);
        
        // Si les traductions ne sont pas fournies, utiliser les valeurs par défaut
        if (isset($data['title']) && empty($data['title_fr'])) {
            $data['title_fr'] = $data['title'];
        }
        if (isset($data['excerpt']) && empty($data['excerpt_fr'])) {
            $data['excerpt_fr'] = $data['excerpt'];
        }
        if (isset($data['content']) && empty($data['content_fr']) && !empty($data['content'])) {
            $data['content_fr'] = $data['content'];
        }

        // Gérer la suppression de l'image principale
        if ($request->has('delete_image') && $request->delete_image === '1') {
            if ($news->image && Storage::disk('public')->exists(str_replace('/storage/', '', $news->image))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $news->image));
            }
            $data['image'] = null;
        } elseif ($request->hasFile('image')) {
            if ($news->image && Storage::disk('public')->exists(str_replace('/storage/', '', $news->image))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $news->image));
            }
            $path = $request->file('image')->store('news/images', 'public');
            $data['image'] = '/storage/' . $path;
        }

        // Gérer la suppression d'images de la galerie
        if ($request->has('delete_gallery_images') && is_array($request->delete_gallery_images) && count($request->delete_gallery_images) > 0) {
            $currentImages = $news->images && is_array($news->images) ? $news->images : [];
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
                    $imagesToKeep[] = '/storage/' . $file->store('news/gallery', 'public');
                }
            }
            
            $data['images'] = $imagesToKeep;
        } elseif ($request->hasFile('images')) {
            // Si de nouvelles images sont uploadées sans suppression spécifique, remplacer toutes les anciennes
            if ($news->images && is_array($news->images)) {
                foreach ($news->images as $oldImg) {
                    if ($oldImg && Storage::disk('public')->exists(str_replace('/storage/', '', $oldImg))) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $oldImg));
                    }
                }
            }
            $paths = [];
            foreach ($request->file('images') as $file) {
                $paths[] = '/storage/' . $file->store('news/gallery', 'public');
            }
            $data['images'] = $paths;
        }

        // Gérer la suppression de la vidéo
        if ($request->has('delete_video') && $request->delete_video === '1') {
            if ($news->video_url && Storage::disk('public')->exists(str_replace('/storage/', '', $news->video_url))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $news->video_url));
            }
            $data['video_url'] = null;
        } elseif ($request->hasFile('video')) {
            // Supprimer l'ancienne vidéo si elle existe
            if ($news->video_url && Storage::disk('public')->exists(str_replace('/storage/', '', $news->video_url))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $news->video_url));
            }
            $videoPath = $request->file('video')->store('news/videos', 'public');
            $data['video_url'] = '/storage/' . $videoPath;
        }

        $news->update($data);

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $news->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    public function stats()
    {
        $total = News::count();
        $published = News::where('is_published', true)->count();
        $drafts = $total - $published;

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'published' => $published,
                'drafts' => $drafts,
            ],
        ]);
    }
}


