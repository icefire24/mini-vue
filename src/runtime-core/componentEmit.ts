export function emit(instance, str: string, ...args) {
    console.log('instance, str: string, ...args: ', instance, str, ...args);
    
    let name = 'on' +
        str.charAt(0).toUpperCase() + str.slice(1)
    console.log(name);
    
    const { props } = instance
    props[name](...args)
}