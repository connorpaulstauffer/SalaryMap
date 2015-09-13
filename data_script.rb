require 'csv'
require 'json'
require 'byebug'

data = { occupations: {} }

CSV.foreach("data.csv", { encoding: 'ISO-8859-1', headers: true, header_converters: :symbol, converters: :all}) do |row|
  begin
    this_row = row.to_hash
    data[:occupations][this_row[:occ_title]] ||= []
    state_hash = {}
    state_hash[:state] = this_row[:state]
    state_hash[:average_salary] = this_row[:a_mean]
    data[:occupations][this_row[:occ_title]] << state_hash
  rescue
    byebug
  end
end

data[:occupations].each do |_, states|
  min = states.min_by { |state| state[:average_salary].to_i }[:average_salary].to_i
  max = states.max_by { |state| state[:average_salary].to_i }[:average_salary].to_i
  states.each do |state|
    if max = min
      state[:distribution] = 0
    else
      begin
        state[:distribution] = (state[:average_salary].to_i - min) / (max - min)
      rescue
        byebug
      end
    end
  end
end

File.open("data.json", "w") do |f|
  f.write(data.to_json)
end
