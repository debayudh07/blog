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
import { Loader2, ImagePlus,  ChevronDown, ChevronUp, X } from "lucide-react"
import Navbar from '@/components/functions/Navbar'

const MotionCard = motion(Card)

const AnimatedSection = ({ title, children, isOpen, toggleOpen }: { title: string, children: React.ReactNode, isOpen: boolean, toggleOpen: () => void }) => (
    <MotionCard className="mb-6 overflow-hidden" layout>
        <CardHeader className="cursor-pointer" onClick={toggleOpen}>
            <CardTitle className="flex justify-between items-center">
                {title}
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </CardTitle>
        </CardHeader>
        <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <CardContent>{children}</CardContent>
        </motion.div>
    </MotionCard>
)

type BasicInfoProps = {
    title: string;
    setTitle: (value: string) => void;
    author: string;
    setAuthor: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    isOpen: boolean;
    toggleOpen: () => void;
};

const BasicInfo = ({ title, setTitle, author, setAuthor, category, setCategory, isOpen, toggleOpen }: BasicInfoProps) => (
    <AnimatedSection title="Basic Information" isOpen={isOpen} toggleOpen={toggleOpen}>
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog post title"
                    required
                    className="mt-1"
                />
            </div>
        
            
            <div>
                <Label htmlFor="author">Author</Label>
                <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </AnimatedSection>
)

const ContentEditor = ({ editor, isOpen, toggleOpen }: { editor: ReturnType<typeof useEditor> | null, isOpen: boolean, toggleOpen: () => void }) => (
    <AnimatedSection title="Content Editor" isOpen={isOpen} toggleOpen={toggleOpen}>
        <div className="border rounded-md p-2 bg-white">
            <EditorContent editor={editor} />
        </div>
    </AnimatedSection>
)

const ImageSection = ({ images, setImages, editor, isOpen, toggleOpen }: { images: { file: File, preview: string }[], setImages: React.Dispatch<React.SetStateAction<{ file: File, preview: string }[]>>, editor: ReturnType<typeof useEditor> | null, isOpen: boolean, toggleOpen: () => void }) => {
    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    }, [setImages]);

    // Remove image from state
    const removeImage = useCallback((index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    }, [setImages]);

    // Add image to editor content
    const addImageToEditor = useCallback((src: string) => {
        if (editor) {
            editor.chain().focus().setImage({ src }).run();
        }
    }, [editor]);

    return (
        <AnimatedSection title="Image Management" isOpen={isOpen} toggleOpen={toggleOpen}>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="w-full"
                    >
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Upload Images
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image.preview}
                                alt={`Uploaded image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md cursor-pointer"
                                onClick={() => addImageToEditor(image.preview)}
                            />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to add to post
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    )
}

const Tags = ({ tags, setTags, isOpen, toggleOpen }: { tags: string, setTags: React.Dispatch<React.SetStateAction<string>>, isOpen: boolean, toggleOpen: () => void }) => (
    <AnimatedSection title="Tags" isOpen={isOpen} toggleOpen={toggleOpen}>
        <Label htmlFor="tags">Enter tags (comma-separated)</Label>
        <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags, separated by commas"
            className="mt-1"
        />
    </AnimatedSection>
)

const SEOSettings = ({ seoTitle, setSeoTitle, seoDescription, setSeoDescription, isOpen, toggleOpen }: { seoTitle: string, setSeoTitle: (value: string) => void, seoDescription: string, setSeoDescription: (value: string) => void, isOpen: boolean, toggleOpen: () => void }) => (
    <AnimatedSection title="SEO Settings" isOpen={isOpen} toggleOpen={toggleOpen}>
        <div className="space-y-4">
            <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                    id="seoTitle"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Enter SEO title"
                    className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                    id="seoDescription"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Enter SEO description"
                    className="mt-1"
                />
            </div>
        </div>
    </AnimatedSection>
)

const PublishSettings = ({ isDraft, setIsDraft, publishDate, setPublishDate, isOpen, toggleOpen }: { isDraft: boolean, setIsDraft: (value: boolean) => void, publishDate: string, setPublishDate: (value: string) => void, isOpen: boolean, toggleOpen: () => void }) => (
    <AnimatedSection title="Publish Settings" isOpen={isOpen} toggleOpen={toggleOpen}>
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Switch
                    id="draft-mode"
                    checked={isDraft}
                    onCheckedChange={setIsDraft}
                />
                <Label htmlFor="draft-mode">Save as draft</Label>
            </div>
            <div>
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                    id="publishDate"
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="mt-1"
                />
            </div>
        </div>
    </AnimatedSection>
)

export default function StylishBlogEditor() {
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
    type OpenSections = {
        [key: string]: boolean;
    };

    const [openSections, setOpenSections] = useState<OpenSections>({
        basicInfo: true,
        contentEditor: true,
        imageSection: false,
        tags: false,
        seoSettings: false,
        publishSettings: false,
    });

    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: '<p>Start writing your blog post here...</p>',
    })

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Prepare the blog post data
        const blogData = {
            title,
            author,
            category,
            content: editor?.getHTML(),
            images: images.map(image => image.file), // Get image files to send to backend
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
        } catch (error) {
            console.error('Error submitting blog post:', error);
            alert('Failed to submit blog post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    return (
        <div>
            <Navbar />

            <div className="container mx-auto py-8 px-4 bg-gray-100 min-h-screen">
                <motion.h1
                    className="text-4xl font-bold mb-6 text-center text-primary"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Create a New Blog Post
                </motion.h1>
                <motion.div
                    className="max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <BasicInfo
                        title={title}
                        setTitle={setTitle}
                        author={author}
                        setAuthor={setAuthor}
                        category={category}
                        setCategory={setCategory}
                        isOpen={openSections.basicInfo}
                        toggleOpen={() => toggleSection('basicInfo')}
                    />
                    <ContentEditor
                        editor={editor}
                        isOpen={openSections.contentEditor}
                        toggleOpen={() => toggleSection('contentEditor')}
                    />
                    <ImageSection
                        images={images}
                        setImages={setImages}
                        editor={editor}
                        isOpen={openSections.imageSection}
                        toggleOpen={() => toggleSection('imageSection')}
                    />
                    <Tags
                        tags={tags}
                        setTags={setTags}
                        isOpen={openSections.tags}
                        toggleOpen={() => toggleSection('tags')}
                    />
                    <SEOSettings
                        seoTitle={seoTitle}
                        setSeoTitle={setSeoTitle}
                        seoDescription={seoDescription}
                        setSeoDescription={setSeoDescription}
                        isOpen={openSections.seoSettings}
                        toggleOpen={() => toggleSection('seoSettings')}
                    />
                    <PublishSettings
                        isDraft={isDraft}
                        setIsDraft={setIsDraft}
                        publishDate={publishDate}
                        setPublishDate={setPublishDate}
                        isOpen={openSections.publishSettings}
                        toggleOpen={() => toggleSection('publishSettings')}
                    />
                    <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark transition-colors duration-300">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Blog Post'
                            )}
                        </Button>

                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

// Removed unnecessary function definition
