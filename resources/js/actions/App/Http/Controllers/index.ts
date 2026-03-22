import DashboardController from './DashboardController'
import TaskController from './TaskController'
import NotificationController from './NotificationController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
TaskController: Object.assign(TaskController, TaskController),
NotificationController: Object.assign(NotificationController, NotificationController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers