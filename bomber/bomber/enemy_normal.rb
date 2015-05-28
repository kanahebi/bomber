module Bomber
  class EnemyNormal < Bomber::Character
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
      random_move
    end

    def random_move
      num = rand(4)
      sleep @delay
      sleep 0.3
      self.send("move_#{action_list[num].to_s}".to_sym)
      sleep 0.2
      self.send("move_#{action_list[num].to_s}".to_sym)
      reject_half
      atack if rand(5) == 0
    end
  end
end