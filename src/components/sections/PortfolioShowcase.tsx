'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import usePortfolio from '@/hooks/usePortfolio' // You can keep this or remove it if props are sufficient
import PortfolioCard from './PortfolioCard'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

// 1. ADD THIS INTERFACE
interface PortfolioShowcaseProps {
  projects: any[];
  technologies: any[];
}

// 2. ACCEPT PROPS IN THE FUNCTION
export default function PortfolioShowcase({ 
  projects: initialProjects, 
  technologies: initialTech 
}: PortfolioShowcaseProps) {
  
  // Use the hook for certificates/loading, or swap entirely to props
  const {
    projects = initialProjects, // Fallback to props if hook is empty
    certificates,
    techStacks = initialTech,    // Fallback to props
    loading,
  } = usePortfolio()

  const [activeTab, setActiveTab] = useState('projects')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [showAllProjects, setShowAllProjects] = useState(false)

  // Logic for slicing projects
  const displayedProjects = showAllProjects
    ? projects
    : projects?.slice(0, 3) || []

  return (
    <>
      {/* ... keep your existing PREVIEW code ... */}

      <section id="portfolio" className="w-full max-w-[1450px] mx-auto px-8 md:px-12 lg:px-20 pt-24 pb-24 text-white">
        {/* ... keep your existing HEADER and TAB code ... */}

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} /* ... */ >
            
            {/* PROJECTS SECTION */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1">
                  <AnimatePresence mode="popLayout">
                    {!loading && displayedProjects.map((item, i) => (
                      <motion.div key={item.id} layout /* ... */ >
                        <PortfolioCard
                          index={i}
                          title={item.title}
                          description={item.description}
                          image={item.image_url}
                          live_url={item.live_url}
                          id={item.id}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                {/* ... keep SEE MORE button ... */}
              </div>
            )}

            {/* CERTIFICATES SECTION - ... keep existing ... */}

            {/* TECH STACK SECTION */}
            {activeTab === 'techstack' && (
              <div className="min-h-[360px] flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-5xl w-full">
                  {!loading && techStacks?.map((item, index) => (
                    <motion.div key={item.id} /* ... */ >
                        {/* ... keep logo logic ... */}
                        <p className="text-[11px] text-white/80 text-center leading-tight px-2 line-clamp-1">
                          {item.name}
                        </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  )
}
