import { defineStore } from 'pinia'
import fetchProjects from './actions/project/fetchProjects'
import createProject from './actions/project/createProject'
import fetchProjectById from './actions/project/fetchProjectById'
import fetchMembers from './actions/project/fetchMembers'
import addMember from './actions/project/addMember'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const members = ref({})
  const isReady = ref(false)
  const isInit = ref({})

  const getProjects = computed(() => projects.value)

  const getInit = computed(() => isInit.value)

  const getMembersByProjectId = (projectId) => {
    return members.value[projectId] || []
  }

  const getProjectById = (projectId) => {
    return projects.value.find(x => x.id === +projectId) || null
  }

  return {
    projects,
    isInit,
    isReady,
    getProjects,
    getInit,
    members,
    fetchProjects,
    addMember,
    createProject,
    fetchProjectById,
    getMembersByProjectId,
    getProjectById,
    fetchMembers
  }
})
