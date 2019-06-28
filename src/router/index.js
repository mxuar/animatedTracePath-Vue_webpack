import Vue from 'vue'
import Router from 'vue-router'
import TraceView from '@/components/TraceView'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'TraceView',
        component: TraceView
    }]
})