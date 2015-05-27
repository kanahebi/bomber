module Bomber
  class Hayashi < Bomber::Character
    attr_accessor :guide, :agl
    def initialize(costume, x, y, angle, delay=0)
      super(costume, x, y, angle)
      @agl = :right
      @delay = delay
      @guide = Bomber::Guide.new(self)
      @guide.trace
    end

    def action_list
      [:up, :down, :right, :left]
    end

    def auto
      lets_go_hayashi
    end

    def lets_go_hayashi
      num = rand(4)
      sleep @delay
      sleep 0.3
      self.send("move_#{action_list[num].to_s}".to_sym)
      sleep 0.2
      self.send("move_#{action_list[num].to_s}".to_sym)
      reject_half
      atack if rand(3) == 0
    end
  end
end