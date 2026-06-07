'use client'
import React, { useState, FormEvent } from 'react'
import { UserPlus, Trash2, Search, Briefcase, ShieldCheck, Users, Mail, DollarSign } from 'lucide-react'

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  salary: string;
}
interface NewEmployeeInput {
  name: string;
  role: string;
  email: string;
  salary: string;
  status: 'Active' | 'On Leave';
}

function ManageEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'Abdul Rehman', role: 'Counter Manager', email: 'abdul@mart.com', status: 'Active', salary: '$1,200' },
    { id: 2, name: 'Sara Khan', role: 'Inventory Admin', email: 'sara@mart.com', status: 'Active', salary: '$1,500' },
    { id: 3, name: 'Zain Ahmed', role: 'Cashier', email: 'zain@mart.com', status: 'On Leave', salary: '$800' },
  ])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [newEmp, setNewEmp] = useState<NewEmployeeInput>({ 
    name: '', 
    role: '', 
    email: '', 
    salary: '', 
    status: 'Active' 
  })

  const handleAddEmployee = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newEmp.name || !newEmp.role || !newEmp.email) return alert('Please fill required fields!')
    
    const newEmployeeObject: Employee = {
      id: Date.now(),
      ...newEmp
    }

    setEmployees([...employees, newEmployeeObject])
    setNewEmp({ name: '', role: '', email: '', salary: '', status: 'Active' }) 
    setIsModalOpen(false) 
  }

  const handleFireEmployee = (id: number, name: string) => {
    const confirmFire = window.confirm(`Are you sure you want to fire ${name}?`)
    if (confirmFire) {
      setEmployees(employees.filter(emp => emp.id !== id))
    }
  }

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen font-sans">
      
      {/* 1. Header Section */}
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

      {/* 2. Mini Stats Board */}
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

      {/* 3. Search Bar */}
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

      {/* 4. Desktop View: Premium Table (Visible on md and larger screens) */}
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
                        <span className="font-semibold text-gray-900">{emp.name}</span>
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
                        onClick={() => handleFireEmployee(emp.id, emp.name)}
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

      {/* 5. Mobile View: Responsive Cards UI (Visible on mobile/tablet) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-y-3 relative">
              
              {/* نام، اسٹیٹس اور فائر بٹن */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{emp.name}</h3>
                  <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-md mt-1">
                    {emp.role}
                  </span>
                </div>
                <button 
                  onClick={() => handleFireEmployee(emp.id, emp.name)}
                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  title="Fire Employee"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <hr className="border-gray-50" />

              {/* ای میل اور سیلری انفارمیشن */}
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

              {/* لائیو اسٹیٹس بیج */}
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

      {/* 6. Add Employee Modal Pop-up (Fully Adaptive) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Member</h3>
            <p className="text-xs text-gray-500 mb-5">Fill in the workspace details for the new staff member.</p>
            
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Shahzaib Khan"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({...newEmp, name: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Work Email *</label>
                <input 
                  type="email" required
                  placeholder="name@mart.com"
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({...newEmp, email: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-900 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Role *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Cashier"
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({...newEmp, role: e.target.value})}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Salary</label>
                  <input 
                    type="text"
                    placeholder="e.g. $1000"
                    value={newEmp.salary}
                    onChange={(e) => setNewEmp({...newEmp, salary: e.target.value})}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-x-2 pt-4 border-t border-gray-100 feedback-actions">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 sm:py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all w-full sm:w-auto"
                >
                  Save & Onboard
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