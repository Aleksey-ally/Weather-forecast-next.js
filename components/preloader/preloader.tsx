import s from './preloader.module.scss'

export const Preloader = () => {
    return (
        <div className={s.loader}>
            <div className={s.segment}></div>
            <div className={s.segment}></div>
            <div className={s.segment}></div>
            <div className={s.segment}></div>
            <div className={s.segment}></div>
            <div className={s.segment}></div>
            <div className={s.segment}></div>
        </div>
    )
}
