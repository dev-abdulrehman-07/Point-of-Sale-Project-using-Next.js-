'use client'
import React, { useState } from 'react'
import { UserPlus, Trash2, Search, Briefcase, ShieldCheck, Users, Mail, DollarSign } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAddemployeeMutation } from '@/lib/store/Api-Hooks/main.api';

interface Employee {
  id: number;
  fullname: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  salary: number;
}

interface NewEmployeeInput {
  fullname: string;
  role: string;
  email: string;
  salary: number;
  status?: 'Active' | 'On Leave';
}

function ManageEmployee() {
  const [newEmployee, { isLoading, data }] = useAddemployeeMutation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewEmployeeInput>()
  
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, fullname: 'Abdul Rehman', role: 'Counter Manager', email: 'abdul@mart.com', status: 'Active', salary: 1200 },
    { id: 2, fullname: 'Sara Khan', role: 'Inventory Admin', email: 'sara@mart.com', status: 'Active', salary: 1500 },
    { id: 3, fullname: 'Zain Ahmed', role: 'Cashier', email: 'zain@mart.com', status: 'On Leave', salary: 800 },
  ])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const onSubmit: SubmitHandler<NewEmployeeInput> = async (formData: NewEmployeeInput) => {
    try {
      await newEmployee(formData).unwrap();
      reset();
    
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  }

  const handleFireEmployee = (id: number, name: string) => {
    const confirmFire = window.confirm(`Are you sure you want to fire ${name}?`)
    if (confirmFire) {
      setEmployees(prev => prev.filter(emp => emp.id !== id))
    }
  }

  const filteredEmployees = employees.filter(emp => 
    emp.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Employee Directory</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage your workforce, roles, and operational permissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-x-2 bg-gray-900 text-white px-4 py-3 sm:py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-sm active:scale-95 w-full sm:w-auto"
        >
          <UserPlus size={18} />
          Add New Employee
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0"><Users size={20} /></div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase">Total Staff</p>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800">{employees.length}</h4>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-x-4">
          <div className="p-3 bg-green-50 text-green-700 rounded-xl flex-shrink-0"><ShieldCheck size={20} /></div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase">Active Now</p>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800">{employees.filter(e => e.status === 'Active').length}</h4>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl flex-shrink-0"><Briefcase size={20} /></div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase">Roles Assigned</p>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800">Premium</h4>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="p-3 sm:p-4 flex items-center gap-x-3 bg-white">
          <Search className="text-gray-400 flex-shrink-0" size={18} />
          <input 
            type="text" 
            placeholder="Search employee by name or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm outline-none placeholder-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Salary</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{emp.fullname}</span>
                        <span className="text-xs text-gray-400">{emp.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-md">
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-x-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        emp.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${emp.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">{emp.salary || '---'}</td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleFireEmployee(emp.id, emp.fullname)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all inline-flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Fire Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-y-3 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{emp.fullname}</h3>
                  <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-md mt-1">
                    {emp.role}
                  </span>
                </div>
                <button 
                  onClick={() => handleFireEmployee(emp.id, emp.fullname)}
                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  title="Fire Employee"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <hr className="border-gray-50" />

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-x-1.5 truncate">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-x-1.5 justify-end font-semibold text-gray-900">
                  <DollarSign size={14} className="text-gray-400" />
                  {emp.salary || '---'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-gray-400 uppercase font-medium">Current Status</span>
                <span className={`inline-flex items-center gap-x-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                  emp.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${emp.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  {emp.status}
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white py-8 text-center text-gray-400 text-sm rounded-2xl border border-dashed">
            No employees found.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            {data?.message && <h3 className="text-xs font-bold text-red- mb-2">{data.message}</h3>}
            <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Member</h3>
            <p className="text-xs text-gray-500 mb-5">Fill in the workspace details for the new staff member.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name *</label>
                <input 
                  type="text"
                  placeholder="e.g. Shahzaib Khan"
                  {...register('fullname', {
                    required: { value: true, message: "Please Enter Employee Name" }
                  })}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-900 transition-colors"
                />
                {errors.fullname && <span className="text-xs text-red-500 mt-1 block">{errors.fullname.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Work Email *</label>
                <input 
                  type="email"
                  placeholder="name@mart.com"
                  {...register('email', {
                    required: { value: true, message: 'Please Enter Email' }
                  })}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-900 transition-colors"
                />
                {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Role *</label>
                  <select 
                    id="role"
                    defaultValue=""
                    {...register('role', {
                      required: { value: true, message: 'Please Enter Role' }
                    })}  
                    className="w-full bg-white text-gray-800 px-4 py-3 pr-10 rounded-xl border border-gray-200 
                               appearance-none cursor-pointer font-medium text-xs
                               transition-all duration-200 ease-in-out
                               hover:border-black hover:shadow-md
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-black"
                  >
                    <option value="" disabled className="text-gray-400">Select a role...</option>
                    <option value="Admin" className="py-2">Admin</option>
                    <option value="employee" className="py-2">Employee</option>
                    <option value="inventoryManager" className="py-2">Inventory Manager</option>
                  </select>
                  {errors.role && <span className="text-xs text-red-500 mt-1 block">{errors.role.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Salary</label>
                  <input 
                    type="number"
                    placeholder="e.g. $1000"
                    {...register('salary', {
                      required: { value: true, message: 'Please Enter Salary' }
                    })}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-900 transition-colors"
                  />
                  {errors.salary && <span className="text-xs text-red-500 mt-1 block">{errors.salary.message}</span>}
                </div>
              </div>

              <input type="hidden" value="Active" {...register('status')} />

              <div className="flex items-center justify-end gap-x-2 pt-4 border-t border-gray-100 feedback-actions">
                <button 
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors w-full sm:w-auto disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2.5 sm:py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all w-full sm:w-auto flex items-center justify-center gap-x-2 disabled:bg-gray-700"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save & Onboard"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default ManageEmployee;