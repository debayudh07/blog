'use client'

import { useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, ImagePlus, X } from "lucide-react"
import Navbar from '@/components/functions/Navbar'
import { AdminGuard } from '@/components/functions/AdminGuard'
import { useAuth } from '@/app/_contexts/Authcontext'
import { useRouter } from 'next/navigation'

const MotionCard = motion(Card)

const FloatingCard = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
    <MotionCard 
        className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 shadow-2xl hover:shadow-primary/20 transition-all duration-500 rounded-3xl overflow-hidden ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02, y: -5 }}
    >
        <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg font-semibold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
            {children}
        </CardContent>
    </MotionCard>
)

type BasicInfoProps = {
    title: string;
    setTitle: (value: string) => void;
    author: string;
    setAuthor: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
};

const BasicInfo = ({ title, setTitle, author, setAuthor, category, setCategory }: BasicInfoProps) => (
    <FloatingCard title="Basic Information" className="h-fit">
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Label htmlFor="title" className="text-gray-300 font-medium text-sm">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog post title"
                    required
                    className="mt-2 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                />
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Label htmlFor="author" className="text-gray-300 font-medium text-sm">Author</Label>
                <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    className="mt-2 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                />
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <Label htmlFor="category" className="text-gray-300 font-medium text-sm">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-2 bg-gray-700/50 border-gray-600/50 text-white focus:border-primary focus:ring-primary/20 transition-all duration-300">
                        <SelectValue placeholder="Select a category" className="text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700/50 text-white">
                        <SelectItem value="technology" className="hover:bg-gray-700/50 focus:bg-gray-700/50">Technology</SelectItem>
                        <SelectItem value="lifestyle" className="hover:bg-gray-700/50 focus:bg-gray-700/50">Lifestyle</SelectItem>
                        <SelectItem value="travel" className="hover:bg-gray-700/50 focus:bg-gray-700/50">Travel</SelectItem>
                        <SelectItem value="food" className="hover:bg-gray-700/50 focus:bg-gray-700/50">Food</SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>
        </div>
    </FloatingCard>
)

const ContentEditor = ({ editor }: { editor: ReturnType<typeof useEditor> | null }) => (
    <FloatingCard title="Content Editor" className="col-span-full">
        <motion.div 
            className="border border-gray-600/50 rounded-xl p-4 bg-gray-700/30 backdrop-blur-sm min-h-[350px] hover:border-gray-500/50 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="prose prose-invert max-w-none">
                <EditorContent 
                    editor={editor} 
                    className="text-gray-300 focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:p-4"
                />
            </div>
        </motion.div>
    </FloatingCard>
)

const ImageSection = ({ images, setImages, editor }: { images: { file: File, preview: string }[], setImages: React.Dispatch<React.SetStateAction<{ file: File, preview: string }[]>>, editor: ReturnType<typeof useEditor> | null }) => {
    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target?.result as string;
                    setImages(prev => [...prev, {
                        file,
                        preview: base64
                    }]);
                };
                reader.readAsDataURL(file);
            });
        }
    }, [setImages]);

    // Remove image from state
    const removeImage = useCallback((index: number) => {
        setImages(prev => {
            const imageToRemove = prev[index];
            // Clean up blob URL if it exists
            if (imageToRemove?.preview?.startsWith('blob:')) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter((_, i) => i !== index);
        });
    }, [setImages]);

    // Add image to editor content
    const addImageToEditor = useCallback((src: string) => {
        if (editor) {
            editor.chain().focus().setImage({ src }).run();
        }
    }, [editor]);

    return (
        <FloatingCard title="Image Management" className="h-fit">
            <div className="space-y-4">
                <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                    />
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="w-full h-10 bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 hover:text-white hover:border-primary/50 transition-all duration-300"
                        >
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Upload Images
                        </Button>
                    </motion.div>
                </motion.div>
                <div className="grid grid-cols-2 gap-3">
                    {images.map((image, index) => (
                        <motion.div 
                            key={index} 
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="relative overflow-hidden rounded-lg border border-gray-600/50 bg-gray-700/30 backdrop-blur-sm">
                                <img
                                    src={image.preview}
                                    alt={`Uploaded image ${index + 1}`}
                                    className="w-full h-20 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                                    onClick={() => addImageToEditor(image.preview)}
                                />
                                <motion.button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={12} />
                                </motion.button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Click to add to post
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </FloatingCard>
    )
}

const Tags = ({ tags, setTags }: { tags: string, setTags: React.Dispatch<React.SetStateAction<string>> }) => (
    <FloatingCard title="Tags" className="h-fit">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Label htmlFor="tags" className="text-gray-300 font-medium text-sm">Enter tags (comma-separated)</Label>
            <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags, separated by commas"
                className="mt-2 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20 transition-all duration-300"
            />
        </motion.div>
    </FloatingCard>
)

const SEOSettings = ({ seoTitle, setSeoTitle, seoDescription, setSeoDescription }: { seoTitle: string, setSeoTitle: (value: string) => void, seoDescription: string, setSeoDescription: (value: string) => void }) => (
    <FloatingCard title="SEO Settings" className="h-fit">
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Label htmlFor="seoTitle" className="text-gray-300 font-medium text-sm">SEO Title</Label>
                <Input
                    id="seoTitle"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Enter SEO title"
                    className="mt-2 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Label htmlFor="seoDescription" className="text-gray-300 font-medium text-sm">SEO Description</Label>
                <Textarea
                    id="seoDescription"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Enter SEO description"
                    className="mt-2 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20 transition-all duration-300 min-h-[80px] resize-none"
                />
            </motion.div>
        </div>
    </FloatingCard>
)

const PublishSettings = ({ isDraft, setIsDraft, publishDate, setPublishDate }: { isDraft: boolean, setIsDraft: (value: boolean) => void, publishDate: string, setPublishDate: (value: string) => void }) => (
    <FloatingCard title="Publish Settings" className="h-fit">
        <div className="space-y-4">
            <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Switch
                    id="draft-mode"
                    checked={isDraft}
                    onCheckedChange={setIsDraft}
                    className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="draft-mode" className="text-gray-300 font-medium cursor-pointer text-sm">Save as draft</Label>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Label htmlFor="publishDate" className="text-gray-300 font-medium text-sm">Publish Date</Label>
                <Input
                    id="publishDate"
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="mt-2 bg-gray-700/50 border-gray-600/50 text-white focus:border-primary focus:ring-primary/20 transition-all duration-300"
                />
            </motion.div>
        </div>
    </FloatingCard>
)

export default function StylishBlogEditor() {
    const { user } = useAuth();
    const router = useRouter();
    
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState('')
    const [seoTitle, setSeoTitle] = useState('')
    const [seoDescription, setSeoDescription] = useState('')
    const [isDraft, setIsDraft] = useState(false)
    const [publishDate, setPublishDate] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<{ file: File, preview: string }[]>([])

    // Redirect if not authenticated
    if (!user) {
        router.push('/');
        return null;
    }

    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: '<p>Start writing your blog post here...</p>',
    })

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (!user) {
            alert('You must be logged in to create a blog post');
            setIsSubmitting(false);
            return;
        }

        // Prepare the blog post data
        const blogData = {
            title,
            author: author || user.displayName || user.email?.split('@')[0] || 'Anonymous',
            authorId: user.uid, // Firebase user ID
            category,
            content: editor?.getHTML(),
            images: images.map(image => image.preview), // Use the preview URLs instead of File objects
            tags: tags.split(',').map(tag => tag.trim()),
            seoTitle,
            seoDescription,
            isDraft,
            publishDate,
        };

        try {
            // Send blog post data to the backend
            const response = await fetch('/api/post-blog', {
                method: 'POST',
                body: JSON.stringify(blogData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to submit blog post');
            }

            const result = await response.json();
            console.log('Blog post submitted successfully:', result);

            alert('Blog post submitted successfully!');
            
            // Reset form or redirect
            router.push('/');
        } catch (error) {
            console.error('Error submitting blog post:', error);
            alert('Failed to submit blog post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <Navbar />

            <div className="container mx-auto py-8 px-4 min-h-screen">
                <motion.h1
                    className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Create a New Blog Post
                </motion.h1>
                
                <motion.form
                    onSubmit={handleSubmit}
                    className="max-w-7xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 auto-rows-min">
                        {/* Basic Info - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <BasicInfo
                                title={title}
                                setTitle={setTitle}
                                author={author}
                                setAuthor={setAuthor}
                                category={category}
                                setCategory={setCategory}
                            />
                        </div>

                        {/* Image Management - Takes 1 column */}
                        <div className="lg:col-span-1">
                            <ImageSection
                                images={images}
                                setImages={setImages}
                                editor={editor}
                            />
                        </div>

                        {/* Tags - Takes 1 column */}
                        <div className="lg:col-span-1">
                            <Tags
                                tags={tags}
                                setTags={setTags}
                            />
                        </div>

                        {/* Content Editor - Full width */}
                        <div className="lg:col-span-4">
                            <ContentEditor editor={editor} />
                        </div>

                        {/* SEO Settings - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <SEOSettings
                                seoTitle={seoTitle}
                                setSeoTitle={setSeoTitle}
                                seoDescription={seoDescription}
                                setSeoDescription={setSeoDescription}
                            />
                        </div>

                        {/* Publish Settings - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <PublishSettings
                                isDraft={isDraft}
                                setIsDraft={setIsDraft}
                                publishDate={publishDate}
                                setPublishDate={setPublishDate}
                            />
                        </div>
                    </div>

                    {/* Main Submit Button */}
                    <motion.div
                        className="mt-12 max-w-md mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <FloatingCard title="Publish Your Post" className="text-center">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting} 
                                    className="w-full h-16 bg-gradient-to-r from-primary to-emerald-400 text-black hover:from-emerald-400 hover:to-primary transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-2xl"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        'Publish Blog Post'
                                    )}
                                </Button>
                            </motion.div>
                        </FloatingCard>
                    </motion.div>
                </motion.form>
            </div>
            </div>
        </AdminGuard>
    )
}
