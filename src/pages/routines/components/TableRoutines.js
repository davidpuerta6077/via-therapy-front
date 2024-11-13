import React from 'react'
const TableRoutines = () => {
    return (
        <div className="routines-data">
            <h5>Rutinas asignadas</h5>
                    <table className="table table-striped-columns p-2">
                <tbody>
                    <tr>
                        <th scope="row">Rutina 1</th>
                        <td>Data 1</td>
                    </tr>
                    <tr>
                        <th scope="row">Rutina 2</th>
                        <td>Data 2</td>
                    </tr>
                </tbody>
        </table>
        </div>
    )
}

export default TableRoutines