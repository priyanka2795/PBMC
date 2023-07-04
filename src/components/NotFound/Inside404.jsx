import React from 'react'
import { Link } from 'react-router-dom'

export default function Inside404() {
    return (
        <>
            <section className='inside404_section'>
                <div className='box'>
                    <h2>404 Not Found</h2>
                    <p>Page does not exists</p>
                    <Link to="/dashboard/home">Back to Home</Link>
                </div>
            </section>
        </>
    )
}
