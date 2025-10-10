/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/JobPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../store/jobSlice";
import type { RootState, AppDispatch } from "../store/store";
import { Spinner } from "../components/Spinner";
import { 
  FaExternalLinkAlt, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSearch as FaSearchIcon
} from "react-icons/fa";

const JobPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Extract categories from job titles
  const extractCategoryFromTitle = (title: string): string => {
    if (!title) return "Other";
    
    const lowerTitle = title.toLowerCase();
    
    // Common job categories and their keywords
    const categoryKeywords: Record<string, string[]> = {
      "IT & Software": ["software", "developer", "programmer", "it", "data", "system", "web", "frontend", "backend", "full stack", "devops", "cloud", "ai", "ml", "technical"],
      "Finance & Accounting": ["finance", "accountant", "financial", "audit", "tax", "banking", "investment", "analysis", "budget"],
      "Marketing & Sales": ["marketing", "sales", "business development", "digital", "brand", "communication", "crm", "revenue"],
      "Human Resources": ["hr", "human resources", "recruitment", "personnel", "training", "talent", "people", "culture"],
      "Healthcare": ["medical", "doctor", "nurse", "health", "pharmaceutical", "clinical", "patient", "therapist"],
      "Engineering": ["engineer", "engineering", "mechanical", "electrical", "civil", "construction", "technical", "maintenance"],
      "Management": ["manager", "management", "director", "executive", "leadership", "operations", "administrative", "supervisor"],
      "Customer Service": ["customer", "service", "support", "call center", "help desk", "client", "relation"],
      "Education": ["teacher", "education", "training", "lecturer", "academic", "school", "learning", "curriculum"],
      "Design": ["design", "designer", "ui", "ux", "graphic", "creative", "visual", "art"]
    };
    
    // Check which category matches the job title
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        return category;
      }
    }
    
    return "Other";
  };

  // Extract unique categories from jobs
  const categories = useMemo(() => {
    const cats = jobs.reduce((acc: string[], job: any) => {
      const category = extractCategoryFromTitle(job.title);
      if (!acc.includes(category)) {
        acc.push(category);
      }
      return acc;
    }, ["All"]); // "All" is always included
    
    return cats;
  }, [jobs]);

  // Group jobs by category
  const jobsByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {
      "All": jobs
    };
    
    jobs.forEach(job => {
      const category = extractCategoryFromTitle(job.title);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(job);
    });
    
    return grouped;
  }, [jobs]);

  // Filter jobs based on selected category and search query
  const filteredJobs = useMemo(() => {
    let result = jobs;
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = jobsByCategory[selectedCategory] || [];
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job => 
        job.title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [selectedCategory, jobs, jobsByCategory, searchQuery]);

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // Job Card Component
  const JobCard = ({ job }: { job: any }) => {
    const category = extractCategoryFromTitle(job.title);
    
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
        <div className="p-5 flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{job.title || "No Title Provided"}</h2>
            <div className="flex flex-col gap-1">
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {job.source || "Unknown"}
              </span>
              <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {category}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 mb-2">
            <FaBuilding className="mr-2 text-blue-500" />
            <span className="font-medium">{job.company || "Company not specified"}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-4">
            <FaMapMarkerAlt className="mr-2 text-red-500" />
            <span>{job.location || "Location not specified"}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <FaCalendarAlt className="mr-2 text-green-500" />
            <span>{job.date_posted ? formatDate(job.date_posted) : "Date not specified"}</span>
          </div>
        </div>
        
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <a
            href={job.link?.startsWith("http") ? job.link : `https://www.careerjet.co.tz${job.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            View Job Details <FaExternalLinkAlt className="ml-2" />
          </a>
        </div>
      </div>
    );
  };

  // Skeleton Loader Component
  const JobCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="flex flex-col gap-1">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="h-4 bg-gray-200 rounded w-8 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="h-4 bg-gray-200 rounded w-8 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        <div className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-8 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );

  // Category Section Component
  const CategorySection = ({ category, jobs }: { category: string; jobs: any[] }) => (
    <div className="mb-10">
      <div 
        className="flex items-center justify-between p-4 bg-white rounded-t-xl border border-gray-200 cursor-pointer"
        onClick={() => toggleCategory(category)}
      >
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-800">{category}</h2>
          <span className="ml-3 bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''}
          </span>
        </div>
        {expandedCategory === category ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      
      {(expandedCategory === category || selectedCategory === category) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-b-xl border border-t-0 border-gray-200">
          {jobs.map((job) => (
            <JobCard key={job.link} job={job} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 mt-10 sm:px-6 border-t">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Latest Job Opportunities</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your next career move from our curated list of job openings across Tanzania
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{jobs.length}</div>
            <div className="text-gray-600">Available Positions</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{categories.length - 1}</div>
            <div className="text-gray-600">Job Categories</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
            <div className="text-gray-600">Updates Frequency</div>
          </div>
        </div>

        {/* Professional Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearchIcon className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                <FaFilter className="mr-2 text-gray-500" />
                Categories:
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setExpandedCategory(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === "All"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Jobs
                </button>
                
                {categories
                  .filter(cat => cat !== "All")
                  .slice(0, 4) // Show first 4 categories
                  .map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setExpandedCategory(null);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                
                {/* More Categories Dropdown */}
                {categories.length > 5 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                        showFilters
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      More
                      <FaChevronDown className="ml-2 text-xs" />
                    </button>
                    
                    {showFilters && (
                      <div className="absolute z-10 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                        <div className="py-1">
                          {categories
                            .filter(cat => cat !== "All")
                            .slice(4) // Show remaining categories
                            .map(category => (
                              <button
                                key={category}
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setExpandedCategory(null);
                                  setShowFilters(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                                  selectedCategory === category
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-10">
            <div className="flex items-center justify-center mb-6">
              <Spinner />
              <span className="ml-3 text-gray-600 font-medium">Loading job opportunities...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-10 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Unable to load jobs</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => dispatch(fetchJobs())}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
              <FaSearch className="text-gray-500 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are currently no job listings available. Please check back later for new opportunities.
            </p>
          </div>
        )}

        {/* Job Listings */}
        {!loading && !error && jobs.length > 0 && (
          <div>
            {showFilters ? (
              // Expandable category sections
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
                {Object.entries(jobsByCategory).map(([category, categoryJobs]) => (
                  <CategorySection 
                    key={category} 
                    category={category} 
                    jobs={categoryJobs} 
                  />
                ))}
              </div>
            ) : (
              // Single category view
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedCategory === "All" ? "All Job Openings" : selectedCategory}
                  </h2>
                  <div className="text-sm text-gray-500">
                    Showing {filteredJobs.length} of {jobs.length} position{jobs.length !== 1 ? 's' : ''}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </div>
                </div>
                
                {filteredJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                      <JobCard key={job.link} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                      <FaSearch className="text-gray-500 text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {searchQuery 
                        ? `No jobs match your search for "${searchQuery}". Try different keywords or clear the search.`
                        : `There are currently no job listings in the ${selectedCategory} category. Try selecting a different category.`
                      }
                    </p>
                    {(searchQuery || selectedCategory !== "All") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("All");
                        }}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm mt-10 pt-6 border-t border-gray-200">
          <p>Jobs are updated daily. Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </main>
  );
};

export default JobPage;