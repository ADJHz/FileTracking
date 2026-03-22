import dashboard from './dashboard'
import tasks from './tasks'
import notifications from './notifications'
const v1 = {
    dashboard: Object.assign(dashboard, dashboard),
tasks: Object.assign(tasks, tasks),
notifications: Object.assign(notifications, notifications),
}

export default v1