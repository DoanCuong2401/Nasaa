export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 relative overflow-hidden">
      {/* Star field background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #ddd, transparent)
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 100px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Grid 3 cột */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left: Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">NEROMIND: Omni-Mind Rising in the New Era</h3>
            <p className="text-gray-300 mb-4">
              There is a three-star making a straight line in the night sky 
              It's been seen through The Eyes of A child
              Darkness doesn't mean loneliness 
              It's about Contemplation
            </p>
            <p className="text-blue-600 font-semibold">SHARE TO BE SHARED</p>
          </div>

          {/* Middle: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#topics" className="hover:text-blue-400 transition-colors">Topics</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#feedback" className="hover:text-blue-400 transition-colors">Feedback</a></li>
            </ul>
          </div>

          {/* Right: Research Areas */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Research Areas</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Vertebrate Studies</li>
              <li>Plant Biology</li>
              <li>Microbiology</li>
              <li>Fungal Research</li>
              <li>Human Cell Biology</li>
              <li>Systems Biology</li>
            </ul>
          </div>
        </div>

        {/* Logos + Slogan */}
        <div className="flex flex-col items-center justify-center mt-6 space-y-4">
          {/* Logos */}
          <div className="flex items-center space-x-6">
            <a href="https://www.facebook.com/share/1EymDZTzCc/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
              <img src="/images/neromind.png" alt="Neromind" className="h-24 w-auto scale-150 object-contain" />
            </a>
            <a href="https://www.facebook.com/share/19nW9Xn6p7/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
              <img src="/images/src.jpg" alt="SRC" className="h-24 w-auto scale-150 object-contain" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61576561960061" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
              <img src="/images/minitech.jpg" alt="MiniTech" className="h-24 w-auto scale-150 object-contain" />
            </a>
          </div>

          {/* Slogan */}
          <div className="text-center">
            <p className="text-blue-400 font-bold text-2xl tracking-wide uppercase text-center">
               WE SINCERELY APPRECIATE YOUR TRUST AND SUPPORT IN USING OUR WEBSITE 
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 NEROMIND - NASA Space Apps Challenge 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
