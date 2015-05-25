module Bomber
  class Ono < Bomber::Character
    attr_accessor :guide, :agl
    def initialize(costume, x, y, angle)
      super
      @agl = :right
      @guide = Bomber::Guide.new(self)
      @guide.trace
    end
  end
end