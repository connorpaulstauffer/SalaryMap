require 'csv'
require 'json'
require 'byebug'

data = { occupations: {} }

CSV.foreach("data.csv", { encoding: 'ISO-8859-1', headers: true, header_converters: :symbol, converters: :all}) do |row|
  begin
    this_row = row.to_hash
    data[:occupations][this_row[:occ_title]] ||= {}
    data[:occupations][this_row[:occ_title]][this_row[:state]] ||= {}
    data[:occupations][this_row[:occ_title]][this_row[:state]][:average_salary] = this_row[:a_mean]
  rescue
    byebug
  end
end

File.open("data.json", "w") do |f|
  f.write(data.to_json)
end
