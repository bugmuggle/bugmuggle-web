import { defineStore } from 'pinia'
import fetchProjects from './actions/project/fetchProjects'
import createProject from './actions/project/createProject'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const isReady = ref(false)

  return { projects, isReady, fetchProjects, createProject }
})
