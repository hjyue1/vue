import 'babel-polyfill'
import App from '../app'
import Messages from 'containers/messages/'
import Drive from 'containers/drive/'
console.log('Messages')
/**
 * 
 */
export default [
    {
        path: '/',
        component: App,
        children: [
            {
            path: '/', 
            name: 'index',
            component: Messages
            },
            {
                path: '/messages', 
                name: 'Messages',
                component: Messages
            },
            {
                path: '/drive', 
                name: 'Drive',
                component: Drive
            }
        ]
    }
]