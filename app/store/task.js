import { defineStore } from 'pinia'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([])
  const myTasks = ref([])
  const assignees = ref([])

  const fetchTasks = async (cid) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/all`)
    tasks.value = res.data.tasks.sort((a, b) => a.order - b.order)

    const resolver = []
    tasks.value.forEach(task => {
      resolver.push(
        $fetch(`/api/channel/${cid}/tasks/${task.id}/assignments/get`)
      )
    })

    const assignments = (await Promise.allSettled(resolver))
      .filter(x => x.status === 'fulfilled')
      .map(x => x.value.data)

    assignees.value = assignments.flat()

    return res
  }

  const createTask = async (cid, name, description, priority) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/create`, {
      method: 'POST',
      body: { name, description, priority },
    })

    if (res.success) {
      tasks.value.push(res.data.task)
    }
  }

  const updateTaskOrders = async (cid, orderString) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/update-task-orders`, {
      method: 'POST',
      body: { orderString },
    })
  }

  const updateTask = async (cid, taskId, updates) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/${taskId}/update`, {
      method: 'POST',
      body: { updates },
    })

    if (res.success) {
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = res.data
      }
    }
  }

  const getTask = (taskId) => {
    return tasks.value.find(t => t.id === taskId)
  }

  const updateTaskAssignees = async (cid, taskId, assigneeIds) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/${taskId}/assignments/assign`, {
      method: 'POST',
      body: { assigneeIds },
    })

    if (res.success) {
      // Clear existing assignees by taskId
      assignees.value = assignees.value.filter(a => a.taskId !== taskId)

      const queryAssignees = await $fetch(`/api/channel/${cid}/tasks/${taskId}/assignments/get`)

      // Add new assignees
      assignees.value.push(...queryAssignees.data.flat())
    }

    return true
  }

  const fetchMyTasks = async () => {
    const res = await $fetch('/api/user/my-tasks')
    if (res.success) {
      myTasks.value = res.data.tasks
    }
    return res
  }

  return { tasks, myTasks, assignees, fetchTasks, fetchMyTasks, createTask, updateTaskOrders, updateTask, getTask, updateTaskAssignees }
})
