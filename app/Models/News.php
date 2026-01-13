<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'title_fr', 'title_ar', 'title_en',
        'excerpt',
        'excerpt_fr', 'excerpt_ar', 'excerpt_en',
        'content',
        'content_fr', 'content_ar', 'content_en',
        'image',
        'images',
        'video_url',
        'published_at',
        'is_published',
    ];
    
    // Accessor pour obtenir le titre selon la langue
    public function getTranslatedTitleAttribute()
    {
        $locale = app()->getLocale();
        $column = "title_{$locale}";
        return $this->$column ?? $this->title_fr ?? $this->title;
    }
    
    // Accessor pour obtenir l'extrait selon la langue
    public function getTranslatedExcerptAttribute()
    {
        $locale = app()->getLocale();
        $column = "excerpt_{$locale}";
        return $this->$column ?? $this->excerpt_fr ?? $this->excerpt;
    }
    
    // Accessor pour obtenir le contenu selon la langue
    public function getTranslatedContentAttribute()
    {
        $locale = app()->getLocale();
        $column = "content_{$locale}";
        return $this->$column ?? $this->content_fr ?? $this->content;
    }

    protected $casts = [
        'published_at' => 'date',
        'is_published' => 'boolean',
        'images' => 'array',
    ];
}
