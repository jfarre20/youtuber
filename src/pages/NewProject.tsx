import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  ArrowLeft,
  Film,
  Settings,
  Zap,
  Users,
  Sparkles,
  Check,
  Info
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { addProject } from '@/store/slices/projectSlice'

const NewProject: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector(state => state.user)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: 'blank',
    outputFormat: 'mp4' as 'mp4' | 'webm',
    quality: 'high' as 'low' | 'medium' | 'high',
    resolution: '1920x1080' as string
  })

  const [currentStep, setCurrentStep] = useState(1)

  const templates = [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start with a clean slate',
      icon: <Plus className="w-6 h-6" />,
      features: ['Custom settings', 'No predefined clips', 'Full control']
    },
    {
      id: 'tutorial',
      name: 'Tutorial Series',
      description: 'Perfect for educational content',
      icon: <Film className="w-6 h-6" />,
      features: ['Structured format', 'Chapter markers', 'Quiz integration ready']
    },
    {
      id: 'social-media',
      name: 'Social Media',
      description: 'Optimized for platforms like YouTube, TikTok',
      icon: <Sparkles className="w-6 h-6" />,
      features: ['Multiple formats', 'Engagement hooks', 'Platform optimization']
    },
    {
      id: 'presentation',
      name: 'Presentation',
      description: 'Business presentations and demos',
      icon: <Users className="w-6 h-6" />,
      features: ['Professional layout', 'Slide transitions', 'Call-to-action ready']
    }
  ]

  const qualityOptions = [
    {
      value: 'low',
      label: 'Low (480p)',
      description: 'Smaller file size, faster processing',
      recommended: 'Mobile viewing'
    },
    {
      value: 'medium',
      label: 'Medium (720p)',
      description: 'Balanced quality and file size',
      recommended: 'Web streaming'
    },
    {
      value: 'high',
      label: 'High (1080p)',
      description: 'Best quality, larger file size',
      recommended: 'Professional content'
    }
  ]

  const resolutionOptions = [
    '1920x1080', '1280x720', '854x480', '640x360'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      return
    }

    // Create the new project
    const newProject = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clips: [],
      status: 'draft' as const,
      tags: [],
      settings: {
        outputFormat: formData.outputFormat,
        quality: formData.quality,
        resolution: formData.resolution
      }
    }

    dispatch(addProject(newProject))
    navigate(`/editor/${newProject.id}`)
  }

  const selectedTemplate = templates.find(t => t.id === formData.template)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/projects"
          className="btn btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Create New Project
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Set up your video editing project with the perfect template and settings
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step <= currentStep
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-secondary-300 text-secondary-500'
              }`}>
                {step < currentStep ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-0.5 ${
                  step < currentStep ? 'bg-primary-500' : 'bg-secondary-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="text-sm text-secondary-600 dark:text-secondary-400">
          {currentStep === 1 && 'Choose Template'}
          {currentStep === 2 && 'Project Details'}
          {currentStep === 3 && 'Output Settings'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* Step 1: Template Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Choose a Template
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Select a template that best fits your project type
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setFormData({...formData, template: template.id})}
                  className={`card cursor-pointer transition-all hover:shadow-medium ${
                    formData.template === template.id
                      ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      formData.template === template.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'
                    }`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                        {template.name}
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400 mb-3">
                        {template.description}
                      </p>
                      <ul className="space-y-1">
                        {template.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                            <Check className="w-3 h-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Project Details
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Tell us about your project
              </p>
            </div>

            <div className="card">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input w-full"
                    placeholder="Enter your project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="input w-full"
                    rows={4}
                    placeholder="Describe your project (optional)"
                  />
                </div>

                {/* Template Preview */}
                {selectedTemplate && (
                  <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        {selectedTemplate.icon}
                      </div>
                      <div>
                        <div className="font-medium text-secondary-900 dark:text-secondary-100">
                          {selectedTemplate.name}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400">
                          Template selected
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Output Settings */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Output Settings
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Configure your video export settings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Output Format */}
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                  Output Format
                </h3>
                <div className="space-y-3">
                  {['mp4', 'webm'].map((format) => (
                    <label key={format} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="outputFormat"
                        value={format}
                        checked={formData.outputFormat === format}
                        onChange={(e) => setFormData({...formData, outputFormat: e.target.value as 'mp4' | 'webm'})}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <div className="font-medium text-secondary-900 dark:text-secondary-100">
                          {format.toUpperCase()}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400">
                          {format === 'mp4' ? 'Universal compatibility' : 'Web-optimized, smaller files'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quality Settings */}
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                  Quality Settings
                </h3>
                <div className="space-y-4">
                  {qualityOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="quality"
                        value={option.value}
                        checked={formData.quality === option.value}
                        onChange={(e) => setFormData({...formData, quality: e.target.value as 'low' | 'medium' | 'high'})}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-secondary-900 dark:text-secondary-100">
                          {option.label}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400">
                          {option.description}
                        </div>
                        <div className="text-xs text-primary-600 dark:text-primary-400">
                          Recommended for: {option.recommended}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div className="card md:col-span-2">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                  Resolution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {resolutionOptions.map((resolution) => (
                    <label key={resolution} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="resolution"
                        value={resolution}
                        checked={formData.resolution === resolution}
                        onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {resolution}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <div className="font-medium">Resolution Tips:</div>
                    <div className="mt-1">
                      1920x1080 (Full HD) - Best for YouTube, professional content<br/>
                      1280x720 (HD) - Good balance for web streaming<br/>
                      854x480 - Suitable for older devices and slower connections
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-secondary-200 dark:border-secondary-700">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            className={`btn btn-secondary flex items-center gap-2 ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
          >
            {currentStep === 3 ? (
              <>
                <Check className="w-4 h-4" />
                Create Project
              </>
            ) : (
              <>
                Next
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewProject
