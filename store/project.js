import { defineStore } from 'pinia'
import fetchProjects from './actions/project/fetchProjects'
import createProject from './actions/project/createProject'
import fetchProjectById from './actions/project/fetchProjectById'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const isReady = ref(false)
  const isInit = ref({})

  const getProjects = computed(() => projects.value)

  const getInit = computed(() => isInit.value)

  return { projects, isInit, isReady, getProjects, fetchProjects, createProject, fetchProjectById, getInit }
})
