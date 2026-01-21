
import React from 'react';
import AssignTask from '../components/AssignTask';

const AdminAssignTaskPage = () => {
    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-slate-700 mb-8">Admin Dashboard</h1>
            <div className="flex flex-col gap-6">
                <p className="text-slate-500">Use the form below to assign new tasks to team members.</p>
                <AssignTask />
            </div>
        </div>
    );
};

export default AdminAssignTaskPage;
