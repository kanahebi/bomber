require "./bomber"
require "yaml"

#$config = true
$all_char = Array.new
datas = YAML.load_file("./config.yml")
back = Bomber::Back.new

back.on(:start) do
  on(:click) do
    put_block
  end
  on(:key_push, K_SPACE) do
    yaml_dump
  end
end

$blocks = Array.new
puts datas.size
datas.each do |data|
  $blocks << block =  Bomber::Block.new(data)
  block.on(:start) do
    on(:click) do
      add_event
    end
  end
end
$all_char << $blocks
$all_char.flatten!
