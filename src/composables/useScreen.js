import { reactive, onMounted, onUnmounted } from 'vue';
export const useScreen = () => {
    const screenBreakpoints = {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
    };

    let screen = reactive({
       width: 0,
       height: 0,
       type: ''
    });

    const onResize = () => {
        screen['width'] = window.innerWidth;
        screen['height'] = window.innerHeight;
        switch (true) {
            case screen.width <= screenBreakpoints.sm:
                screen['type'] = "xs";
                break;
            case screen.width <= screenBreakpoints.md:
                screen['type'] = "sm";
                break;
            case screen.width <= screenBreakpoints.lg:
                screen['type'] = "md";
                break;
            case screen.width <= screenBreakpoints.xl:
                screen['type'] = "lg";
                break;
            default:
                screen['type'] = "xl";
                break;
        }
    };

    const setScreenListener = () => {
        onResize();
        window.addEventListener('resize', onResize);
    };
    const removeScreenListener = () => {
        window.removeEventListener('resize', onResize);
    };
    return {
        screen,
        screenBreakpoints,
        setScreenListener,
        removeScreenListener
    };
};
