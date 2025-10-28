#!/usr/bin/env ruby
require 'yaml'

latest = YAML.safe_load_file('noisy/meta.yaml')['published-versions'].keys.last
puts "Will serve #{latest}"
Dir.chdir("noisy/#{latest}") or abort "cd failed"
exec('npx', 'serve')
