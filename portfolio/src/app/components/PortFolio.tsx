"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TerminalPortfolio = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    'Welcome to Backend Developer Terminal v1.0',
    'Type "help" to see available commands.',
    '------------------------------------------------'
  ]);
  const terminalRef = useRef(null);

  const commands = {
    help: () => [
      'Available commands:',
      '',
      '  System Commands:',
      '    clear       Clear the terminal',
      '    about       About me',
      '',
      '  Portfolio Commands:',
      '    skills      Display technical skills',
      '    projects    View my projects',
      '    contact     Show contact information',
      '    github      Get GitHub profile',
      '',
      '  Demo Commands:',
      '    deploy      Simulate deployment process',
      '    status      Check system status',
      '    benchmark   Run performance tests'
    ],
    about: () => [
      'Backend Developer',
      '----------------',
      '• 5+ years of experience in distributed systems',
      '• Specialized in high-performance APIs and data pipelines',
      '• Tech stack: Go, Python, Node.js, Kubernetes'
    ],
    skills: () => [
      'Technical Skills',
      '---------------',
      '• Languages:      Go, Python, Java, Node.js',
      '• Databases:      PostgreSQL, MongoDB, Redis, Elasticsearch',
      '• Infrastructure: AWS, Kubernetes, Docker, Terraform',
      '• Messaging:      Kafka, RabbitMQ, gRPC, GraphQL'
    ],
    projects: () => [
      'Key Projects',
      '-----------',
      '1. Distributed Message Queue',
      '   • 1M+ messages/second',
      '   • 99.99% uptime',
      '   • Built with Kafka, Go, Redis',
      '',
      '2. API Gateway',
      '   • 10K requests/second',
      '   • 50ms p95 latency',
      '   • Node.js, Docker, K8s',
      '',
      '3. Real-time Analytics',
      '   • 5TB daily data processing',
      '   • Flink, Elasticsearch'
    ],
    contact: () => [
      'Contact Information',
      '------------------',
      'Email:    dev@example.com',
      'LinkedIn: linkedin.com/in/backend-dev',
      'GitHub:   github.com/backend-dev'
    ],
    github: () => [
      'Opening GitHub profile...',
      'https://github.com/backend-dev',
      '',
      'Recent contributions:',
      '• 500+ commits this year',
      '• 20+ open source projects',
      '• Active in Go and Python communities'
    ],
    clear: () => {
      setOutput([]);
      return [];
    },
    status: () => [
      'System Status',
      '-------------',
      'API Gateway:    🟢 Online (99.99% uptime)',
      'Message Queue:  🟢 Online (0ms latency)',
      'Database:       🟢 Online (2ms response)',
      'Cache:          🟢 Online (95% hit ratio)',
      'Load Balancer:  🟢 Online (balanced)'
    ],
    deploy: () => {
      const steps = [
        'Starting deployment process...',
        'Running unit tests...',
        'Building containers...',
        'Pushing to registry...',
        'Updating Kubernetes manifests...',
        'Rolling out deployment...',
        'Running health checks...',
        'Deployment completed successfully!'
      ];
      
      steps.forEach((step, index) => {
        setTimeout(() => {
          setOutput(prev => [...prev, step]);
        }, index * 1000);
      });
      
      return [''];
    },
    benchmark: () => [
      'Running performance tests...',
      '',
      'API Endpoint Tests:',
      '✓ GET  /api/users       2ms    1000 req/s',
      '✓ POST /api/data       15ms     800 req/s',
      '✓ PUT  /api/update     12ms     900 req/s',
      '',
      'Database Performance:',
      '✓ Read operations      0.8ms    2000 ops/s',
      '✓ Write operations     1.2ms    1500 ops/s',
      '',
      'Cache Performance:',
      '✓ Hit ratio: 95%',
      '✓ Avg latency: 0.3ms'
    ]
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (trimmedCmd === '') return;

    const newOutput = [...output, `$ ${cmd}`];
    
    if (commands[trimmedCmd]) {
      newOutput.push(...commands[trimmedCmd]());
    } else {
      newOutput.push(`Command not found: ${cmd}. Type "help" for available commands.`);
    }
    
    setOutput(newOutput);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Backend Developer Terminal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={terminalRef}
              className="h-[calc(100vh-200px)] overflow-y-auto mb-4 font-mono text-sm md:text-base whitespace-pre-wrap text-green-400"
            >
              {output.map((line, i) => (
                <div key={i} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
            <div className="flex items-center font-mono">
              <span className="mr-2 text-green-400">$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none outline-none text-green-400 w-full font-mono"
                placeholder="Type a command..."
                autoFocus
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TerminalPortfolio;