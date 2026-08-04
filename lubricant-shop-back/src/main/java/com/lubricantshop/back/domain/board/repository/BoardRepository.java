package com.lubricantshop.back.domain.board.repository;

import com.lubricantshop.back.domain.board.Board;
import com.lubricantshop.back.domain.board.AnswerStatus;
import com.lubricantshop.back.domain.board.BoardType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {

    List<Board> findByBoardTypeAndDeletedFalseOrderByCreatedAtDesc(BoardType boardType);

    List<Board> findByWriterMemberIdAndBoardTypeAndDeletedFalseOrderByCreatedAtDesc(Long writerId, BoardType boardType);

    boolean existsByWriterMemberIdAndBoardTypeAndAnswerStatusAndAnswerCheckedFalseAndDeletedFalse(
            Long writerId,
            BoardType boardType,
            AnswerStatus answerStatus
    );
}
