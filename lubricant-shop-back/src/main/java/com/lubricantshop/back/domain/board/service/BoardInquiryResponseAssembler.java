package com.lubricantshop.back.domain.board.service;

import com.lubricantshop.back.domain.board.Board;
import com.lubricantshop.back.domain.board.dto.AnswerResponse;
import com.lubricantshop.back.domain.board.dto.InquiryDetailResponse;
import com.lubricantshop.back.domain.board.dto.InquiryResponse;
import com.lubricantshop.back.domain.board.repository.BoardAnswerRepository;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class BoardInquiryResponseAssembler {

    private final BoardAnswerRepository boardAnswerRepository;

    public BoardInquiryResponseAssembler(BoardAnswerRepository boardAnswerRepository) {
        this.boardAnswerRepository = boardAnswerRepository;
    }

    public InquiryDetailResponse toDetailResponse(Board board) {
        List<AnswerResponse> answers = boardAnswerRepository.findByBoardBoardIdOrderByCreatedAtAsc(board.getBoardId())
                .stream()
                .map(AnswerResponse::from)
                .toList();

        return new InquiryDetailResponse(InquiryResponse.from(board), answers);
    }
}
