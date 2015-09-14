require 'csv'
require 'json'
require 'byebug'

data = { occupations: {},  categories: { "All Categories" => [] } }
category = nil
current_state = nil
CSV.foreach("data.csv", { encoding: 'ISO-8859-1', headers: true, header_converters: :symbol, converters: :all}) do |row|
  begin
    this_row = row.to_hash
    next if ["Puerto Rico", "Guam", "Virgin Islands"].include?(this_row[:state])
    unless this_row[:a_mean] == "*"
      data[:occupations][this_row[:occ_title]] ||= {}
      data[:occupations][this_row[:occ_title]][:states] ||= {}
      data[:occupations][this_row[:occ_title]][:states][this_row[:state]] ||= {}
      data[:occupations][this_row[:occ_title]][:states][this_row[:state]][:average_salary] = this_row[:a_mean]
    end

    next if this_row[:occ_group] == "total"
    if this_row[:occ_group] == "major"
      category = this_row[:occ_title]
      data[:categories][category] ||= []
    else
      unless data[:categories][category].include?(this_row[:occ_title])
        data[:categories][category] << this_row[:occ_title]
      end

      unless data[:categories]["All Categories"].include?(this_row[:occ_title])
        data[:categories]["All Categories"] << this_row[:occ_title]
      end
    end
  rescue
    byebug
  end
end

data[:occupations].each do |_, occupation|
  states = occupation[:states]
  occupation[:data] = {}
  min = states.min_by do |state, val|
    val[:average_salary].gsub(",", "").to_i
  end[1][:average_salary].gsub(",", "").to_f

  max = states.max_by do |state, val|
    val[:average_salary].gsub(",", "").to_i
  end[1][:average_salary].gsub(",", "").to_f

  occupation[:data][:max] = max
  occupation[:data][:min] = min
  occupation[:data][:mean] = states.map do |_, v|
    v[:average_salary].gsub(",", "").to_i
  end.inject(:+) / states.length

  states.each do |state, val|
    if max == min
      val[:distribution] = 0
    else
      val[:distribution] = (val[:average_salary].gsub(",", "").to_f - min) / (max - min)
    end
  end
end

File.open("data.json", "w") do |f|
  f.write(data.to_json)
end
