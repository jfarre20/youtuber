import React, { useRef, useState, useCallback } from 'react'
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatFileSize } from '@/utils/format'

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  disabled?: boolean
  className?: string
  onFilesSelected: (files: File[]) => void
  onError?: (error: string) => void
}

interface FilePreview {
  file: File
  id: string
  preview?: string
  error?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = '*',
  multiple = false,
  maxSize = 100 * 1024 * 1024, // 100MB default
  maxFiles = 10,
  disabled = false,
  className,
  onFilesSelected,
  onError,
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FilePreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`
    }

    // Check file type if specified
    if (accept !== '*' && accept !== '') {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const fileType = file.type
      const fileName = file.name.toLowerCase()

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          // File extension
          return fileName.endsWith(type.toLowerCase())
        } else if (type.includes('/')) {
          // MIME type
          return fileType === type || fileType.startsWith(type.split('/')[0] + '/')
        }
        return false
      })

      if (!isAccepted) {
        return `File type not supported. Accepted: ${accept}`
      }
    }

    return null
  }, [accept, maxSize])

  // Process selected files
  const processFiles = useCallback((fileList: FileList) => {
    const selectedFiles = Array.from(fileList)

    // Check max files limit
    if (!multiple && selectedFiles.length > 1) {
      onError?.('Only one file can be selected')
      return
    }

    if (selectedFiles.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: File[] = []
    const filePreviews: FilePreview[] = []

    selectedFiles.forEach((file, index) => {
      const error = validateFile(file)

      if (error) {
        filePreviews.push({
          file,
          id: `file-${Date.now()}-${index}`,
          error
        })
        onError?.(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
        filePreviews.push({
          file,
          id: `file-${Date.now()}-${index}`,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        })
      }
    })

    setFiles(prev => [...prev, ...filePreviews])

    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }, [multiple, maxFiles, validateFile, onFilesSelected, onError])

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList && fileList.length > 0) {
      processFiles(fileList)
    }
    // Reset input
    e.target.value = ''
  }, [processFiles])

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const fileList = e.dataTransfer.files
    if (fileList && fileList.length > 0) {
      processFiles(fileList)
    }
  }, [disabled, processFiles])

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId)
      // Revoke object URL to prevent memory leaks
      const removedFile = prev.find(f => f.id === fileId)
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview)
      }
      return newFiles
    })
  }, [])

  // Clear all files
  const clearAllFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
  }, [files])

  // Trigger file dialog
  const triggerFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
          isDragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
        onClick={disabled ? undefined : triggerFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 text-secondary-400">
            <Upload className="w-full h-full" />
          </div>

          <div>
            <p className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
              {isDragOver ? 'Drop files here' : 'Upload files'}
            </p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              {multiple ? 'Select multiple files' : 'Select a file'} or drag and drop
            </p>
          </div>

          {(accept !== '*' || maxSize < Infinity) && (
            <div className="text-xs text-secondary-500 dark:text-secondary-400 space-y-1">
              {accept !== '*' && (
                <p>Accepted types: {accept}</p>
              )}
              <p>Max size: {formatFileSize(maxSize)}</p>
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              Selected Files ({files.length})
            </h4>
            <button
              onClick={clearAllFiles}
              className="text-xs text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((filePreview) => (
              <div
                key={filePreview.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  filePreview.error
                    ? 'border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/20'
                    : 'border-secondary-200 bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800'
                )}
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {filePreview.preview ? (
                    <img
                      src={filePreview.preview}
                      alt={filePreview.file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-secondary-200 dark:bg-secondary-700 rounded flex items-center justify-center">
                      <File className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                    {filePreview.file.name}
                  </p>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">
                    {formatFileSize(filePreview.file.size)}
                  </p>
                  {filePreview.error && (
                    <p className="text-xs text-error-600 dark:text-error-400 mt-1">
                      {filePreview.error}
                    </p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {filePreview.error ? (
                    <AlertCircle className="w-5 h-5 text-error-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-success-500" />
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(filePreview.id)}
                  className="flex-shrink-0 p-1 rounded hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
                >
                  <X className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
