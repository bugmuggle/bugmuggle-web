import { defineStore } from 'pinia'
import fetchVariables from '@/store/actions/variable/fetchVariables'
import createVariable from '@/store/actions/variable/createVariable'
import deleteVariable from '@/store/actions/variable/deleteVariable'

export const useVariableStore = defineStore('variable', () => {
  const list = ref([])
  const isReady = ref({})

  const getVariables = (projectId) => list.value.filter(x => x.projectId === projectId)
  const getVariable = (id) => list.value.find(x => x.id === id)

  const isProjectVariablesReady = (projectId) => !!isReady.value['project-' + projectId]

  return {
    list,
    isReady,

    isProjectVariablesReady,
    getVariables,
    getVariable,
    fetchVariables,
    createVariable,
    deleteVariable
  }
})
