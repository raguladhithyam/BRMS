import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Clock, Shield, Phone, Mail, MapPin, CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const [stats, setStats] = useState({
    donors: 0,
    livesSaved: 0,
    hospitals: 0,
    responseTime: 0
  });

  // Animate stats on load
  useEffect(() => {
    const animateStats = () => {
      setStats({
        donors: 500,
        livesSaved: 200,
        hospitals: 50,
        responseTime: 24
      });
    };
    
    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Top Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-gray-200/50 w-full"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-2 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-xl shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  BloodConnect
                </span>
                <p className="text-xs text-gray-500 -mt-1 font-medium">Life. Connected.</p>
              </div>
            </motion.div>
            <div className="flex items-center space-x-6">
              <Link to="/request-blood" className="text-gray-600 hover:text-red-600 transition-colors font-medium">
                Request Blood
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-red-600 transition-colors font-medium">
                Become Donor
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-white"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                className="flex items-center mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm shadow-lg">
                  <Heart className="h-8 w-8" />
                </div>
                <span className="ml-3 text-lg font-medium">Trusted by 500+ Donors</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Save Lives
                <motion.span 
                  className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Instantly
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Connect blood requestors with verified student donors through our AI-powered matching system. 
                <span className="font-semibold text-yellow-300"> Average response time: 2 hours</span>
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <Link to="/request-blood">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-gray-50 text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <Zap className="mr-2 h-6 w-6 group-hover:animate-pulse" />
                    Request Blood Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="bg-white/20 text-white border-white hover:bg-white/30 text-lg px-8 py-4 rounded-xl backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <Users className="mr-2 h-6 w-6" />
                    Become a Donor
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-6 text-white/80"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                  <span>Verified Donors</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-300" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-300" />
                  <span>24/7 Support</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center text-white">
                  <motion.div 
                    className="text-6xl font-bold mb-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stats.livesSaved}+
                  </motion.div>
                  <div className="text-xl mb-6">Lives Saved</div>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="bg-white/20 rounded-xl p-4 hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold">{stats.donors}+</div>
                      <div className="text-sm">Active Donors</div>
                    </motion.div>
                    <motion.div 
                      className="bg-white/20 rounded-xl p-4 hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold">{stats.hospitals}+</div>
                      <div className="text-sm">Partner Hospitals</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How BloodConnect Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined process ensures quick response times and secure connections 
              between blood requestors and donors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card hover className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-100 rounded-full">
                  <Heart className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Submit Request</h3>
              <p className="text-gray-600">
                Fill out our simple form with your blood requirements, location, and urgency level.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Matched</h3>
              <p className="text-gray-600">
                Our system instantly matches you with eligible donors based on blood type and location.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Safely</h3>
              <p className="text-gray-600">
                Receive donor contact information securely after admin verification and donor consent.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Registered Donors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">200+</div>
              <div className="text-gray-600">Lives Saved</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Partner Hospitals</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted & Secure Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your safety and privacy are our top priorities. All requests are verified 
              by our admin team before donor matching.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Admin Verification</h3>
                    <p className="text-gray-600">All blood requests are reviewed and verified by our medical admin team.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Verified Donors</h3>
                    <p className="text-gray-600">All student donors are pre-screened and verified for safety.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Real-time Updates</h3>
                    <p className="text-gray-600">Get instant notifications about your request status and donor responses.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary-600" />
                  <span>+91 9952810338</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary-600" />
                  <span>vbc@kct.ac.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <span>Available 24/7 across the city</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of life-savers. Every donation matters, every request counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/request-blood">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                Request Blood Now
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                Join as Donor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary-400" />
                <span className="font-bold text-lg">BloodConnect</span>
              </div>
              <p className="text-gray-400">
                Connecting blood requestors with willing donors to save lives in our community.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/request-blood" className="hover:text-white">Request Blood</Link></li>
                <li><Link to="/register" className="hover:text-white">Become Donor</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Emergency Contact</li>
                <li>FAQs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>vbc@kct.ac.in</li>
                <li>+91 9952810338</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BloodConnect. All rights reserved. Saving lives together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};