'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from './Button'

interface UploadedFile {
  id: string
  filename: string
  originalName: string
  path: string
  size: number
  type: string
  category: string
  uploadedAt: string
}

interface FileUploadProps {
  category?: string
  multiple?: boolean
  maxFiles?: number
  acceptedTypes?: string[]
  maxSize?: number // in bytes
  onUpload?: (files: UploadedFile[]) => void
  onRemove?: (fileId: string) => void
  existingFiles?: UploadedFile[]
  disabled?: boolean
  label?: string
  description?: string
}

export function FileUpload({
  category = 'documents',
  multiple = false,
  maxFiles = 5,
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxSize = 10 * 1024 * 1024, // 10MB
  onUpload,
  onRemove,
  existingFiles = [],
  disabled = false,
  label = 'Upload Documents',
  description = 'Drag and drop files here, or click to select files'
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (fileList: FileList) => {
    if (disabled) return
    
    setError(null)
    const newFiles = Array.from(fileList)

    // Check file count
    if (!multiple && newFiles.length > 1) {
      setError('Please select only one file')
      return
    }

    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate files
    for (const file of newFiles) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`)
        return
      }

      if (!acceptedTypes.includes(file.type)) {
        setError(`File type "${file.type}" is not allowed`)
        return
      }
    }

    setUploading(true)

    try {
      const uploadedFiles: UploadedFile[] = []

      for (const file of newFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', category)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const result = await response.json()
        uploadedFiles.push(result.file)
      }

      const updatedFiles = [...files, ...uploadedFiles]
      setFiles(updatedFiles)
      onUpload?.(updatedFiles)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [files, category, maxFiles, maxSize, acceptedTypes, multiple, disabled, onUpload])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true)
    }
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleRemove = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    setFiles(updatedFiles)
    onRemove?.(fileId)
    onUpload?.(updatedFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return '🖼️'
    if (type.includes('pdf')) return '📄'
    if (type.includes('word')) return '📝'
    return '📎'
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          {description}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary hover:bg-gray-50'}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {uploading ? (
          <div className="space-y-2">
            <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-foreground">
              {description}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, Word, Images • Max {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border"
              >
                <div className="text-lg">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(file.id)
                  }}
                  disabled={disabled}
                  className="p-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 