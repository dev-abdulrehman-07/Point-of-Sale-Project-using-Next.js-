"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { stepdecreaser, stepincreaser } from '@/lib/store/Slices/stepSlice';
import CustomerForm from './afterProcessStepComp/customerForm';
import TakeAmount from './afterProcessStepComp/TakeAmount';
import GiveBill from './afterProcessStepComp/GiveBill';


const Stepper = () => {
    const currentStep = useAppSelector((state) => state.stepchanger.currentstep)  
    const dispatch = useAppDispatch() 
   
  const totalSteps = 3;

  const steps = [
    { number: 1, label: "Step One" },
    { number: 2, label: "Step Two" },
    { number: 3, label: "Step Three" }
  ];

  return (
    <div className="flex flex-col h-full w-full mx-auto px-10 py-">
      {/* Stepper Container */}
      <div className=" relative w-full border h-25  flex items-center justify-between">
        
        {/* Background Connector Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full" />

        {/* Active Progress Line Animation */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 z-0 rounded-full"
          style={{ backgroundColor: '#ccff66' }}
          initial={{ width: "0%" }}
          animate={{ 
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              {/* Step Circle */}
              <motion.button
            
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300"
                style={{
                  backgroundColor: isCompleted ? '#ccff66' : isActive ? '#1e293b' : '#1e293b',
                  borderColor: isCompleted || isActive ? '#ccff66' : '#475569',
                  color: isCompleted ? '#000000' : isActive ? '#ccff66' : '#94a3b8',
                  boxShadow: isActive ? '0 0 12px rgba(204, 255, 102, 0.4)' : 'none'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? (
                  /* Tick Icon (Black for contrast against lime green) */
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </motion.button>

              {/* Step Label */}
              <span 
                className={`absolute top-12 whitespace-nowrap text-xs font-semibold transition-colors duration-300`}
                style={{
                  color: isActive || isCompleted ? '#ccff66' : '#94a3b8'
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

<div className='border flex-1'>
    
          {currentStep === 1 && (
            <CustomerForm/>
          )}
          {currentStep === 2 && (
            <TakeAmount/>
          )}
          {currentStep === 3 && (
            <GiveBill/>
          )}
</div> 

    </div>
  );
};

export default Stepper;