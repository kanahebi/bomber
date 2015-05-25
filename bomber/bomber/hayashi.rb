module Bomber
  class Hayashi < Bomber::Character
    attr_accessor :guide, :agl
    def initialize(costume, x, y, angle)
      super
      @agl = :right
      @guide = Bomber::Guide.new(self)
      @guide.trace
    end

    def action_list
      [:move_up, :move_down, :move_right, :move_left]
    end

    def lets_go_hayashi(delay=0)
      num = rand(4)
      sleep delay
      sleep 0.3
      self.send(action_list[num])
      sleep 0.2
      self.send(action_list[num])
      reject_half
      atack if rand(3)
    end
  end
end