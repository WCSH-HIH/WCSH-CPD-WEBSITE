/* ========================================
   WCSH CPD CENTER - COURSES JAVASCRIPT
   Course catalog data
   Email: cpdwcsh@gmail.com
   Phone: +251-91-615-4691
   ======================================== */

// ========================================
// COURSE DATA ARRAY
// ========================================

const coursesData = [
    {
        id: 1,
        title: "Advanced Emergency Medicine",
        category: "Clinical CPD",
        credits: 15,
        audience: "Physicians, Emergency Staff",
        description: "Comprehensive emergency care protocols, trauma management, and critical interventions for emergency medicine practitioners.",
        duration: "3 weeks",
        format: "In-person",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID" // Replace with actual Google Form link
    },
    {
        id: 2,
        title: "Evidence-Based Nursing Practice",
        category: "Nursing & Midwifery",
        credits: 10,
        audience: "Nurses, Nurse Practitioners",
        description: "Latest nursing research, patient care methodologies, and evidence-based clinical decision-making for modern nursing practice.",
        duration: "2 weeks",
        format: "Hybrid",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 3,
        title: "Healthcare Quality Improvement",
        category: "Quality Improvement",
        credits: 12,
        audience: "All Healthcare Professionals",
        description: "Quality metrics, patient safety protocols, continuous improvement methodologies, and implementation strategies.",
        duration: "10 days",
        format: "Online",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 4,
        title: "Clinical Research Methods",
        category: "Research & Innovation",
        credits: 20,
        audience: "Researchers, Clinicians",
        description: "Comprehensive training in clinical research design, implementation, data analysis, and academic publishing.",
        duration: "4 weeks",
        format: "In-person",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 5,
        title: "Healthcare Leadership & Management",
        category: "Leadership & Management",
        credits: 15,
        audience: "Department Heads, Managers",
        description: "Strategic leadership, team management, resource optimization, and organizational development in healthcare settings.",
        duration: "3 weeks",
        format: "Hybrid",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 6,
        title: "Digital Health Systems",
        category: "Digital Health",
        credits: 8,
        audience: "IT Staff, Clinicians",
        description: "Electronic health records, health informatics, digital healthcare tools, and telemedicine implementation.",
        duration: "1 week",
        format: "Online",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 7,
        title: "Maternal & Child Health",
        category: "Clinical CPD",
        credits: 18,
        audience: "OB/GYN, Midwives, Pediatricians",
        description: "Comprehensive maternal health protocols, obstetric emergencies, neonatal care, and pediatric best practices.",
        duration: "3 weeks",
        format: "In-person",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 8,
        title: "Infection Prevention & Control",
        category: "Clinical CPD",
        credits: 10,
        audience: "All Healthcare Workers",
        description: "Hospital infection prevention, antimicrobial stewardship, outbreak management, and biosafety protocols.",
        duration: "5 days",
        format: "In-person",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 9,
        title: "Advanced Midwifery Skills",
        category: "Nursing & Midwifery",
        credits: 12,
        audience: "Midwives, Labor Ward Staff",
        description: "Advanced obstetric skills, high-risk pregnancy management, emergency obstetric care, and newborn resuscitation.",
        duration: "2 weeks",
        format: "In-person",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 10,
        title: "Health Systems Research",
        category: "Research & Innovation",
        credits: 15,
        audience: "Researchers, Policy Makers",
        description: "Health systems analysis, policy research, implementation science, and health economics evaluation.",
        duration: "3 weeks",
        format: "Hybrid",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 11,
        title: "Patient Safety & Risk Management",
        category: "Quality Improvement",
        credits: 10,
        audience: "Quality Officers, Managers",
        description: "Patient safety culture, adverse event analysis, risk assessment, and safety improvement strategies.",
        duration: "1 week",
        format: "In-person",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    },
    {
        id: 12,
        title: "Healthcare Data Analytics",
        category: "Digital Health",
        credits: 12,
        audience: "Data Analysts, Administrators",
        description: "Healthcare data management, statistical analysis, data visualization, and evidence-based decision making.",
        duration: "2 weeks",
        format: "Online",
        registrationLink: "https://forms.google.com/YOUR_FORM_ID"
    }
];

// ========================================
// RENDER COURSES ON PAGE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const coursesGrid = document.getElementById('coursesGrid');
    const searchInput = document.getElementById('courseSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const noCoursesMessage = document.getElementById('noCoursesMessage');
    
    if (!coursesGrid) return; // Not on programs page
    
    // Function to create course card HTML
    function createCourseCard(course) {
        return `
            <div class="course-card" data-category="${course.category}">
                <div style="margin-bottom: 1rem;">
                    <span style="display: inline-block; background-color: #EFF6FF; color: #3B82F6; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700;">
                        ${course.category}
                    </span>
                </div>
                <h3 style="color: #1F2937; font-size: 1.35rem; margin-bottom: 0.875rem; font-weight: 800;">
                    ${course.title}
                </h3>
                <p style="color: #6B7280; font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.7;">
                    ${course.description}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 0.9rem; color: #4B5563;">
                    <span>🎓 ${course.credits} Credits</span>
                    <span>⏱️ ${course.duration}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.9rem; color: #4B5563;">
                    <span>👥 ${course.audience}</span>
                    <span>📍 ${course.format}</span>
                </div>
                <button onclick="handleCourseRegistration('${course.title.replace(/'/g, "\\'")}', '${course.registrationLink}')" 
                        class="btn btn-primary" 
                        style="width: 100%; padding: 0.875rem;">
                    Register Now
                </button>
            </div>
        `;
    }
    
    // Function to render courses
    function renderCourses(coursesToRender) {
        if (coursesToRender.length === 0) {
            coursesGrid.style.display = 'none';
            if (noCoursesMessage) noCoursesMessage.style.display = 'block';
        } else {
            coursesGrid.style.display = 'grid';
            if (noCoursesMessage) noCoursesMessage.style.display = 'none';
            coursesGrid.innerHTML = coursesToRender.map(course => createCourseCard(course)).join('');
        }
    }
    
    // Function to filter courses
    function filterCourses() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        
        const filteredCourses = coursesData.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                                course.description.toLowerCase().includes(searchTerm) ||
                                course.audience.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        renderCourses(filteredCourses);
    }
    
    // Initial render
    renderCourses(coursesData);
    
    // Event listeners for search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterCourses);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCourses);
    }
});

// ========================================
// HANDLE COURSE REGISTRATION
// ========================================

function handleCourseRegistration(courseTitle, registrationLink) {
    if (registrationLink && registrationLink !== "https://forms.google.com/YOUR_FORM_ID") {
        // Open the actual registration form
        window.open(registrationLink, '_blank');
    } else {
        // Fallback: Show contact information
        alert(`Course Registration: ${courseTitle}\n\nTo register for this course, please contact:\n\n📧 Email: cpdwcsh@gmail.com\n📞 Phone: +251-91-615-4691\n\nWe will send you the registration form and course details.`);
    }
}

// ========================================
// EXPORT FOR USE IN OTHER FILES
// ========================================

window.coursesData = coursesData;

// ========================================
// END OF COURSES.JS
// ========================================