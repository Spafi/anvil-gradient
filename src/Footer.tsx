export default function Footer() {

    const startYear = 2023
    const currentYear = new Date().getFullYear()
    const period = currentYear===startYear ? startYear.toString() : `${ startYear } - ${ currentYear }`

    return <div className='absolute bottom-0 flex align-items-center justify-content-center w-full border-1'>
        <div className='footer flex justify-content-center '>
            <p>Crafted with <i className="bi bi-heart-fill"></i> and powered by <i className="bi bi-cup-hot-fill"></i> | All rights reserved <a
                    href='https://github.com/Spafi'> Spaf</a> { period }
            </p>
        </div>
    </div>
}
