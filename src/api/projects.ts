import { apiClient } from './client'
import {
  GetProjectsParams,
  GetProjectsResponse,
  CreateProjectResponse,
  UpdateProjectResponse,
  DeleteProjectResponse,
  ExportProjectResponse,
  GetExportStatusResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ExportProjectRequest,
  Project
} from '@/types/api'

export const projectsApi = {
  // Get all projects with pagination and filters
  async getProjects(params?: GetProjectsParams): Promise<GetProjectsResponse> {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.tags?.length) queryParams.append('tags', params.tags.join(','))
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const url = `/projects${queryParams.toString() ? `?${queryParams}` : ''}`
    return apiClient.get<Project[]>(url)
  },

  // Get single project by ID
  async getProject(id: string): Promise<{ data: Project }> {
    return apiClient.get<Project>(`/projects/${id}`)
  },

  // Create new project
  async createProject(projectData: CreateProjectRequest): Promise<CreateProjectResponse> {
    return apiClient.post<CreateProjectResponse['data']>('/projects', projectData)
  },

  // Update project
  async updateProject(
    id: string,
    updates: UpdateProjectRequest
  ): Promise<UpdateProjectResponse> {
    return apiClient.patch<UpdateProjectResponse['data']>(`/projects/${id}`, updates)
  },

  // Delete project
  async deleteProject(id: string): Promise<DeleteProjectResponse> {
    return apiClient.delete<DeleteProjectResponse['data']>(`/projects/${id}`)
  },

  // Duplicate project
  async duplicateProject(id: string): Promise<CreateProjectResponse> {
    return apiClient.post<CreateProjectResponse['data']>(`/projects/${id}/duplicate`)
  },

  // Get project statistics
  async getProjectStats(id: string): Promise<{
    data: {
      clipsCount: number
      totalDuration: number
      storageUsed: number
      lastModified: string
    }
  }> {
    return apiClient.get(`/projects/${id}/stats`)
  },

  // Export project
  async exportProject(
    id: string,
    exportOptions: ExportProjectRequest,
    onProgress?: (progress: number) => void
  ): Promise<ExportProjectResponse> {
    return apiClient.post<ExportProjectResponse['data']>(
      `/projects/${id}/export`,
      exportOptions,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      }
    )
  },

  // Get export status
  async getExportStatus(
    projectId: string,
    exportId: string
  ): Promise<GetExportStatusResponse> {
    return apiClient.get<GetExportStatusResponse['data']>(
      `/projects/${projectId}/export/${exportId}`
    )
  },

  // Cancel export
  async cancelExport(projectId: string, exportId: string): Promise<{ data: { message: string } }> {
    return apiClient.post(`/projects/${projectId}/export/${exportId}/cancel`)
  },

  // Get project versions (for undo/redo)
  async getProjectVersions(
    id: string,
    page = 1,
    limit = 20
  ): Promise<{
    data: Array<{
      id: string
      version: number
      changes: string
      createdAt: string
      userId: string
    }>
  }> {
    return apiClient.get(`/projects/${id}/versions?page=${page}&limit=${limit}`)
  },

  // Revert project to specific version
  async revertProject(
    id: string,
    versionId: string
  ): Promise<{ data: { message: string } }> {
    return apiClient.post(`/projects/${id}/revert/${versionId}`)
  },

  // Share project
  async shareProject(
    id: string,
    shareOptions: {
      emails: string[]
      permission: 'view' | 'edit'
      message?: string
    }
  ): Promise<{ data: { shareId: string; message: string } }> {
    return apiClient.post(`/projects/${id}/share`, shareOptions)
  },

  // Get project collaborators
  async getProjectCollaborators(id: string): Promise<{
    data: Array<{
      id: string
      email: string
      permission: 'view' | 'edit'
      invitedAt: string
      acceptedAt?: string
    }>
  }> {
    return apiClient.get(`/projects/${id}/collaborators`)
  },

  // Remove project collaborator
  async removeCollaborator(
    projectId: string,
    collaboratorId: string
  ): Promise<{ data: { message: string } }> {
    return apiClient.delete(`/projects/${projectId}/collaborators/${collaboratorId}`)
  },

  // Update collaborator permission
  async updateCollaboratorPermission(
    projectId: string,
    collaboratorId: string,
    permission: 'view' | 'edit'
  ): Promise<{ data: { message: string } }> {
    return apiClient.patch(`/projects/${projectId}/collaborators/${collaboratorId}`, {
      permission,
    })
  },

  // Accept project invitation
  async acceptInvitation(shareId: string): Promise<{ data: { message: string } }> {
    return apiClient.post(`/projects/invitation/${shareId}/accept`)
  },

  // Decline project invitation
  async declineInvitation(shareId: string): Promise<{ data: { message: string } }> {
    return apiClient.post(`/projects/invitation/${shareId}/decline`)
  },

  // Get user's project invitations
  async getProjectInvitations(): Promise<{
    data: Array<{
      id: string
      projectId: string
      projectName: string
      inviterEmail: string
      permission: 'view' | 'edit'
      invitedAt: string
    }>
  }> {
    return apiClient.get('/projects/invitations')
  },

  // Archive project
  async archiveProject(id: string): Promise<{ data: { message: string } }> {
    return apiClient.post(`/projects/${id}/archive`)
  },

  // Unarchive project
  async unarchiveProject(id: string): Promise<{ data: { message: string } }> {
    return apiClient.post(`/projects/${id}/unarchive`)
  },

  // Get archived projects
  async getArchivedProjects(params?: GetProjectsParams): Promise<GetProjectsResponse> {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)

    return apiClient.get<Project[]>(`/projects/archived?${queryParams}`)
  },
}
