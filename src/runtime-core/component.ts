export const createComponentInstance = (vnode) => {
    //生成组件实例
    const component = {
        vnode,
        type:vnode.type
    }
    return component;
};

export const setupComponent = (instance) => {

        //initProps()    
        //initSlots()
        setupStatefulComponent(instance)
};

const setupStatefulComponent = (instance) => {
    const Component = instance.type
    
    const { setup } = Component
    
    if (setup) {
        const setupResult= setup()
        handleSetupResult(instance,setupResult)
    }
};

const handleSetupResult = (instance,setupResult) => {
    if (typeof setupResult == 'object') {
        instance.setupState=setupResult
    }

    finishComponentSetup(instance)
};

const finishComponentSetup = (instance) => {
    const Component = instance.type
    if (!Component.render) {
        instance.render=Component.render
    }
};